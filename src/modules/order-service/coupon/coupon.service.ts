import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { paginateOptions } from 'src/common/constants';
import { IPaginatedResponse, OrderStatus } from 'src/common/interface';
import { paginationHelpers, pick } from 'src/utils/helpers';
import { getPaginatedData } from 'src/utils/mongodb/getPaginatedData';
import { Order, OrderDocument } from '../order/schemas/order.schema';
import {
  couponFilterableFields,
  couponSearchableFields,
  couponSortOptions,
} from './coupon.constants';
import { CouponValidationDto, CreateCouponDto } from './dto/coupon.dto';
import {
  CouponQueryOptions,
  CouponUsageQueryOptions,
} from './dto/coupon.query-options.dto';
import {
  CouponUsage,
  CouponUsageDocument,
} from './schemas/coupon-usage.schema';
import { Coupon, CouponDocument, DiscountType } from './schemas/coupon.schema';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private couponModel: Model<CouponDocument>,
    @InjectModel(CouponUsage.name)
    private couponUsageModel: Model<CouponUsageDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(payload: CreateCouponDto): Promise<CouponDocument> {
    const existing = await this.couponModel.findOne({
      code: payload?.code?.toUpperCase(),
    });
    if (existing) throw new ConflictException('Coupon code already exists');

    return this.couponModel.create({
      ...payload,
      code: payload?.code?.toUpperCase(),
      eligibleUserIds: (payload.eligibleUserIds || []).map(
        (id) => new Types.ObjectId(id),
      ),
    });
  }

  async findAll(
    query: CouponQueryOptions,
  ): Promise<IPaginatedResponse<CouponDocument>> {
    const paginateQueries = pick(query, paginateOptions);
    const filterableFields = pick(query, couponFilterableFields as any);
    const { searchTerm, ...remainingFilters } = filterableFields;

    const filterQuery: FilterQuery<CouponDocument> = {
      ...remainingFilters,
    };

    if (searchTerm) {
      filterQuery['$or'] = couponSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      }));
    }

    const pagination = paginationHelpers.calculatePagination(paginateQueries);

    if (pagination.sortBy && (couponSortOptions as any)[pagination.sortBy]) {
      const sortOption = (couponSortOptions as any)[pagination.sortBy];
      const field = Object.keys(sortOption)[0];
      pagination.sortBy = field;
      pagination.sortOrder = sortOption[field];
    }

    return await getPaginatedData<CouponDocument>({
      model: this.couponModel,
      paginationQuery: pagination,
      filterQuery,
    });
  }

  async findById(id: string): Promise<CouponDocument> {
    const coupon = await this.couponModel.findById(id);
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async findActiveCouponById(
    id: string,
    session?: ClientSession,
  ): Promise<CouponDocument> {
    const coupon = await this.couponModel.findById(id).session(session || null);
    if (!coupon) throw new NotFoundException('Coupon not found');
    if (!coupon.isActive) throw new NotFoundException('Coupon is inactive');
    return coupon;
  }

  async findActiveCouponByCode(
    code: string,
    session?: ClientSession,
  ): Promise<CouponDocument> {
    const coupon = await this.couponModel
      .findOne({ code: code.toUpperCase(), isActive: true })
      .session(session || null);
    if (!coupon) throw new NotFoundException('Coupon not found or inactive');
    return coupon;
  }

  async update(id: string, dto: CreateCouponDto): Promise<CouponDocument> {
    const updatePayload: any = { ...dto };
    if (dto.code) {
      updatePayload.code = dto.code.toUpperCase();
    }
    if (dto.eligibleUserIds) {
      updatePayload.eligibleUserIds = dto.eligibleUserIds.map(
        (userId) => new Types.ObjectId(userId),
      );
    }

    const updated = await this.couponModel.findByIdAndUpdate(
      id,
      updatePayload,
      {
        new: true,
      },
    );
    if (!updated) throw new NotFoundException(`Coupon with ID ${id} not found`);
    return updated;
  }

  async delete(id: string): Promise<CouponDocument> {
    const deleted = await this.couponModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException(`Coupon with ID ${id} not found`);
    return deleted;
  }

  async toggle(id: string): Promise<CouponDocument> {
    const coupon = await this.couponModel.findById(id);
    if (!coupon) throw new NotFoundException(`Coupon with ID ${id} not found`);

    coupon.isActive = !coupon.isActive;
    return coupon.save();
  }

  /**
   * Get available and applicable coupons for guest or logged-in users.
   * If guest: returns active public coupons.
   * If logged-in: returns active public and targeted coupons evaluated against user criteria (e.g. first order, per-user limits).
   */
  async getAvailableCoupons(userId?: string, orderAmount?: number) {
    const now = new Date();

    const baseQuery: FilterQuery<CouponDocument> = {
      isActive: true,
      validFrom: { $lte: now },
      validTo: { $gte: now },
      $expr: {
        $or: [
          { $eq: ['$usageLimit', 0] },
          { $lt: ['$usageCount', '$usageLimit'] },
        ],
      },
    };

    if (!userId) {
      // Guest user: show public active coupons
      const coupons = await this.couponModel
        .find({
          ...baseQuery,
          isPublic: true,
        })
        .sort({ createdAt: -1 })
        .lean();

      return coupons.map((coupon) => {
        let isEligible = true;
        let reasonIfNotEligible: string | undefined;

        if (coupon.isFirstOrderOnly) {
          isEligible = false;
          reasonIfNotEligible = 'Log in to apply first-order coupon';
        } else if (
          orderAmount !== undefined &&
          coupon.minOrderAmount &&
          orderAmount < coupon.minOrderAmount
        ) {
          isEligible = false;
          reasonIfNotEligible = `Requires minimum order of ${coupon.minOrderAmount}`;
        }

        const discountPreview = this.calculateDiscountPreview(
          coupon,
          orderAmount,
        );

        return {
          ...coupon,
          isEligible,
          reasonIfNotEligible,
          discountPreview,
        };
      });
    }

    // Authenticated user: check order history & coupon usage
    const userObjectId = new Types.ObjectId(userId);

    const [userOrderCount, candidateCoupons] = await Promise.all([
      this.orderModel.countDocuments({
        userId: userObjectId,
        status: { $ne: OrderStatus.CANCELLED },
      }),
      this.couponModel
        .find({
          ...baseQuery,
          $or: [
            { isPublic: true },
            { eligibleUserIds: userObjectId },
          ],
        })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const isNewUser = userOrderCount === 0;
    const candidateIds = candidateCoupons.map((c) => c._id);

    // Fetch user usage counts for these coupons
    const usages = await this.couponUsageModel.aggregate([
      {
        $match: {
          userId: userObjectId,
          couponId: { $in: candidateIds },
        },
      },
      {
        $group: {
          _id: '$couponId',
          count: { $sum: 1 },
        },
      },
    ]);

    const usageCountMap = new Map<string, number>(
      usages.map((u) => [u._id.toString(), u.count]),
    );

    return candidateCoupons.map((coupon) => {
      const userUsage = usageCountMap.get(coupon._id.toString()) || 0;
      let isEligible = true;
      let reasonIfNotEligible: string | undefined;

      if (
        coupon.usageLimitPerUser > 0 &&
        userUsage >= coupon.usageLimitPerUser
      ) {
        isEligible = false;
        reasonIfNotEligible = 'You have reached the usage limit for this coupon';
      } else if (coupon.isFirstOrderOnly && !isNewUser) {
        isEligible = false;
        reasonIfNotEligible = 'Valid only on your first order';
      } else if (
        coupon.eligibleUserIds &&
        coupon.eligibleUserIds.length > 0 &&
        !coupon.eligibleUserIds.some((id) => id.toString() === userId)
      ) {
        isEligible = false;
        reasonIfNotEligible = 'This coupon is not available for your account';
      } else if (
        orderAmount !== undefined &&
        coupon.minOrderAmount &&
        orderAmount < coupon.minOrderAmount
      ) {
        isEligible = false;
        reasonIfNotEligible = `Requires minimum order of ${coupon.minOrderAmount}`;
      }

      const discountPreview = this.calculateDiscountPreview(
        coupon,
        orderAmount,
      );

      return {
        ...coupon,
        isEligible,
        reasonIfNotEligible,
        userUsageCount: userUsage,
        discountPreview,
      };
    });
  }

  private calculateDiscountPreview(
    coupon: any,
    orderAmount?: number,
  ): number | undefined {
    if (orderAmount === undefined || orderAmount <= 0) return undefined;

    let discount = 0;
    if (coupon.discountType === DiscountType.PERCENTAGE) {
      discount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else if (coupon.discountType === DiscountType.FIXED_AMOUNT) {
      discount = Math.min(coupon.discountValue, orderAmount);
    } else if (coupon.discountType === DiscountType.FREE_SHIPPING) {
      discount = 0;
    }

    return Math.round(discount * 100) / 100;
  }

  async validateCoupon(payload: CouponValidationDto): Promise<CouponDocument> {
    const { code, couponId, userId, orderAmount } = payload;
    const coupon = code
      ? await this.findActiveCouponByCode(code)
      : couponId
        ? await this.findActiveCouponById(couponId)
        : null;

    if (!coupon) throw new NotFoundException('Coupon not found');

    const now = new Date();

    if (now < coupon.validFrom)
      throw new BadRequestException('Coupon is not valid yet!');

    if (now > coupon.validTo)
      throw new BadRequestException('Coupon is expired!');

    if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit)
      throw new BadRequestException('Coupon usage limit reached!');

    if (coupon.isFirstOrderOnly) {
      if (!userId) {
        throw new BadRequestException(
          'Please sign in to apply this first-order coupon',
        );
      }
      const orderCount = await this.orderModel.countDocuments({
        userId: new Types.ObjectId(userId),
        status: { $ne: OrderStatus.CANCELLED },
      });
      if (orderCount > 0) {
        throw new BadRequestException(
          'This coupon is valid only on your first order',
        );
      }
    }

    if (
      coupon.eligibleUserIds &&
      coupon.eligibleUserIds.length > 0
    ) {
      if (
        !userId ||
        !coupon.eligibleUserIds.some((id) => id.toString() === userId.toString())
      ) {
        throw new BadRequestException(
          'This coupon is not valid for your account',
        );
      }
    }

    if (
      userId &&
      coupon.usageLimitPerUser > 0 &&
      coupon.usageCount >= coupon.usageLimitPerUser
    )
      throw new BadRequestException('Coupon usage limit per user reached!');

    if (userId) {
      await this.checkUsageLimit(coupon, userId);
    }

    if (orderAmount && orderAmount < coupon.minOrderAmount)
      throw new BadRequestException(
        'Order amount is less than minimum order amount!',
      );

    return coupon;
  }

  async incrementUsage(
    payload: ICouponUsagePayload,
    session?: ClientSession,
  ): Promise<void> {
    await this.couponModel
      .findByIdAndUpdate(payload.couponId, { $inc: { usageCount: 1 } })
      .session(session || null);

    await this.logUsage(payload, session);
  }

  async checkUsageLimit(coupon: CouponDocument, userId: string): Promise<void> {
    if (!coupon) throw new NotFoundException('Coupon not found');

    const usageCount = await this.couponUsageModel.countDocuments({
      couponId: coupon._id,
      userId,
    });

    if (
      coupon.usageLimitPerUser > 0 &&
      usageCount >= coupon.usageLimitPerUser
    ) {
      throw new BadRequestException(
        'You have reached the usage limit for this coupon',
      );
    }
  }

  async logUsage(payload: ICouponUsagePayload, session?: ClientSession) {
    const usage = new this.couponUsageModel(payload);
    await usage.save({ session });
  }

  async getCouponUsageHistory(
    query: CouponUsageQueryOptions,
  ): Promise<IPaginatedResponse<CouponUsageDocument>> {
    const paginateQueries = pick(query, paginateOptions);
    const { searchTerm, ...remainingFilters } = query;

    const filterQuery = {};

    if (searchTerm) {
      filterQuery['$or'] = couponSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      }));
    }

    if (Object.keys(remainingFilters).length) {
      filterQuery['$and'] = Object.entries(remainingFilters).map(
        ([key, value]) => ({
          [key]: value,
        }),
      );
    }

    const pagination = paginationHelpers.calculatePagination(paginateQueries);

    return await getPaginatedData<CouponUsageDocument>({
      model: this.couponUsageModel,
      paginationQuery: pagination,
      filterQuery,
    });
  }
}

