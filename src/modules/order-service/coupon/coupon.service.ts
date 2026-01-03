import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { paginateOptions } from 'src/common/constants';
import { IPaginatedResponse } from 'src/common/interface';
import { paginationHelpers, pick } from 'src/utils/helpers';
import { getPaginatedData } from 'src/utils/mongodb/getPaginatedData';
import { couponSearchableFields } from './coupon.constants';
import { CouponValidationDto, CreateCouponDto } from './dto/coupon.dto';
import {
  CouponQueryOptions,
  CouponUsageQueryOptions,
} from './dto/coupon.query-options.dto';
import {
  CouponUsage,
  CouponUsageDocument,
} from './schemas/coupon-usage.schema';
import { Coupon, CouponDocument } from './schemas/coupon.schema';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private couponModel: Model<CouponDocument>,
    @InjectModel(CouponUsage.name)
    private couponUsageModel: Model<CouponUsageDocument>,
  ) {}

  async create(payload: CreateCouponDto): Promise<CouponDocument> {
    const existing = await this.couponModel.findOne({
      code: payload?.code?.toUpperCase(),
    });
    if (existing) throw new ConflictException('Coupon code already exists');

    return this.couponModel.create({
      ...payload,
      code: payload?.code?.toUpperCase(),
    });
  }

  async findAll(
    query: CouponQueryOptions,
  ): Promise<IPaginatedResponse<CouponDocument>> {
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
    const updated = await this.couponModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
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
