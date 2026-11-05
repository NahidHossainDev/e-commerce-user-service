"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../../common/constants");
const interface_1 = require("../../../common/interface");
const helpers_1 = require("../../../utils/helpers");
const getPaginatedData_1 = require("../../../utils/mongodb/getPaginatedData");
const order_schema_1 = require("../order/schemas/order.schema");
const coupon_constants_1 = require("./coupon.constants");
const coupon_usage_schema_1 = require("./schemas/coupon-usage.schema");
const coupon_schema_1 = require("./schemas/coupon.schema");
let CouponService = class CouponService {
    couponModel;
    couponUsageModel;
    orderModel;
    constructor(couponModel, couponUsageModel, orderModel) {
        this.couponModel = couponModel;
        this.couponUsageModel = couponUsageModel;
        this.orderModel = orderModel;
    }
    async create(payload) {
        if (payload.discountType === coupon_schema_1.DiscountType.PERCENTAGE &&
            payload.discountValue > 100) {
            throw new common_1.BadRequestException('Percentage discount cannot exceed 100%');
        }
        if (new Date(payload.validTo) <= new Date(payload.validFrom)) {
            throw new common_1.BadRequestException('Validity end date must be after start date');
        }
        const existing = await this.couponModel.findOne({
            code: payload?.code?.toUpperCase(),
        });
        if (existing)
            throw new common_1.ConflictException('Coupon code already exists');
        return this.couponModel.create({
            ...payload,
            code: payload?.code?.toUpperCase(),
            eligibleUserIds: (payload.eligibleUserIds || []).map((id) => new mongoose_2.Types.ObjectId(id)),
        });
    }
    async findAll(query) {
        const paginateQueries = (0, helpers_1.pick)(query, constants_1.paginateOptions);
        const filterableFields = (0, helpers_1.pick)(query, coupon_constants_1.couponFilterableFields);
        const { searchTerm, ...remainingFilters } = filterableFields;
        const filterQuery = {
            ...remainingFilters,
        };
        if (searchTerm) {
            filterQuery['$or'] = coupon_constants_1.couponSearchableFields.map((field) => ({
                [field]: { $regex: searchTerm, $options: 'i' },
            }));
        }
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        if (pagination.sortBy && coupon_constants_1.couponSortOptions[pagination.sortBy]) {
            const sortOption = coupon_constants_1.couponSortOptions[pagination.sortBy];
            const field = Object.keys(sortOption)[0];
            pagination.sortBy = field;
            pagination.sortOrder = sortOption[field];
        }
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.couponModel,
            paginationQuery: pagination,
            filterQuery,
        });
    }
    async findById(id) {
        const coupon = await this.couponModel.findById(id);
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        return coupon;
    }
    async findActiveCouponById(id, session) {
        const coupon = await this.couponModel.findById(id).session(session || null);
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        if (!coupon.isActive)
            throw new common_1.NotFoundException('Coupon is inactive');
        return coupon;
    }
    async findActiveCouponByCode(code, session) {
        const coupon = await this.couponModel
            .findOne({ code: code.toUpperCase(), isActive: true })
            .session(session || null);
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found or inactive');
        return coupon;
    }
    async update(id, dto) {
        if (dto.discountType === coupon_schema_1.DiscountType.PERCENTAGE &&
            dto.discountValue !== undefined &&
            dto.discountValue > 100) {
            throw new common_1.BadRequestException('Percentage discount cannot exceed 100%');
        }
        if (dto.validTo &&
            dto.validFrom &&
            new Date(dto.validTo) <= new Date(dto.validFrom)) {
            throw new common_1.BadRequestException('Validity end date must be after start date');
        }
        const updatePayload = { ...dto };
        if (dto.code) {
            updatePayload.code = dto.code.toUpperCase();
        }
        if (dto.eligibleUserIds) {
            updatePayload.eligibleUserIds = dto.eligibleUserIds.map((userId) => new mongoose_2.Types.ObjectId(userId));
        }
        const updated = await this.couponModel.findByIdAndUpdate(id, updatePayload, {
            new: true,
        });
        if (!updated)
            throw new common_1.NotFoundException(`Coupon with ID ${id} not found`);
        return updated;
    }
    async delete(id) {
        const deleted = await this.couponModel.findByIdAndDelete(id);
        if (!deleted)
            throw new common_1.NotFoundException(`Coupon with ID ${id} not found`);
        return deleted;
    }
    async toggle(id) {
        const coupon = await this.couponModel.findById(id);
        if (!coupon)
            throw new common_1.NotFoundException(`Coupon with ID ${id} not found`);
        coupon.isActive = !coupon.isActive;
        return coupon.save();
    }
    async getAvailableCoupons(userId, orderAmount) {
        const now = new Date();
        const baseQuery = {
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
            const coupons = await this.couponModel
                .find({
                ...baseQuery,
                isPublic: true,
            })
                .sort({ createdAt: -1 })
                .lean();
            return coupons.map((coupon) => {
                let isEligible = true;
                let reasonIfNotEligible;
                if (coupon.isFirstOrderOnly) {
                    isEligible = false;
                    reasonIfNotEligible = 'Log in to apply first-order coupon';
                }
                else if (orderAmount !== undefined &&
                    coupon.minOrderAmount &&
                    orderAmount < coupon.minOrderAmount) {
                    isEligible = false;
                    reasonIfNotEligible = `Requires minimum order of ${coupon.minOrderAmount}`;
                }
                const discountPreview = this.calculateDiscountPreview(coupon, orderAmount);
                return {
                    ...coupon,
                    isEligible,
                    reasonIfNotEligible,
                    discountPreview,
                };
            });
        }
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const [userOrderCount, candidateCoupons] = await Promise.all([
            this.orderModel.countDocuments({
                userId: userObjectId,
                status: { $ne: interface_1.OrderStatus.CANCELLED },
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
        const usageCountMap = new Map(usages.map((u) => [u._id.toString(), u.count]));
        return candidateCoupons.map((coupon) => {
            const userUsage = usageCountMap.get(coupon._id.toString()) || 0;
            let isEligible = true;
            let reasonIfNotEligible;
            if (coupon.usageLimitPerUser > 0 &&
                userUsage >= coupon.usageLimitPerUser) {
                isEligible = false;
                reasonIfNotEligible = 'You have reached the usage limit for this coupon';
            }
            else if (coupon.isFirstOrderOnly && !isNewUser) {
                isEligible = false;
                reasonIfNotEligible = 'Valid only on your first order';
            }
            else if (coupon.eligibleUserIds &&
                coupon.eligibleUserIds.length > 0 &&
                !coupon.eligibleUserIds.some((id) => id.toString() === userId)) {
                isEligible = false;
                reasonIfNotEligible = 'This coupon is not available for your account';
            }
            else if (orderAmount !== undefined &&
                coupon.minOrderAmount &&
                orderAmount < coupon.minOrderAmount) {
                isEligible = false;
                reasonIfNotEligible = `Requires minimum order of ${coupon.minOrderAmount}`;
            }
            const discountPreview = this.calculateDiscountPreview(coupon, orderAmount);
            return {
                ...coupon,
                isEligible,
                reasonIfNotEligible,
                userUsageCount: userUsage,
                discountPreview,
            };
        });
    }
    calculateDiscountPreview(coupon, orderAmount) {
        if (orderAmount === undefined || orderAmount <= 0)
            return undefined;
        let discount = 0;
        if (coupon.discountType === coupon_schema_1.DiscountType.PERCENTAGE) {
            discount = (orderAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
                discount = coupon.maxDiscountAmount;
            }
        }
        else if (coupon.discountType === coupon_schema_1.DiscountType.FIXED_AMOUNT) {
            discount = Math.min(coupon.discountValue, orderAmount);
        }
        else if (coupon.discountType === coupon_schema_1.DiscountType.FREE_SHIPPING) {
            discount = 0;
        }
        return Math.round(discount * 100) / 100;
    }
    async validateCoupon(payload) {
        const { code, couponId, userId, orderAmount } = payload;
        const coupon = code
            ? await this.findActiveCouponByCode(code)
            : couponId
                ? await this.findActiveCouponById(couponId)
                : null;
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        const now = new Date();
        if (now < coupon.validFrom)
            throw new common_1.BadRequestException('Coupon is not valid yet!');
        if (now > coupon.validTo)
            throw new common_1.BadRequestException('Coupon is expired!');
        if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit)
            throw new common_1.BadRequestException('Coupon usage limit reached!');
        if (coupon.isFirstOrderOnly) {
            if (!userId) {
                throw new common_1.BadRequestException('Please sign in to apply this first-order coupon');
            }
            const orderCount = await this.orderModel.countDocuments({
                userId: new mongoose_2.Types.ObjectId(userId),
                status: { $ne: interface_1.OrderStatus.CANCELLED },
            });
            if (orderCount > 0) {
                throw new common_1.BadRequestException('This coupon is valid only on your first order');
            }
        }
        if (coupon.eligibleUserIds &&
            coupon.eligibleUserIds.length > 0) {
            if (!userId ||
                !coupon.eligibleUserIds.some((id) => id.toString() === userId.toString())) {
                throw new common_1.BadRequestException('This coupon is not valid for your account');
            }
        }
        if (userId) {
            await this.checkUsageLimit(coupon, userId);
        }
        if (orderAmount !== undefined &&
            coupon.minOrderAmount !== undefined &&
            coupon.minOrderAmount > 0 &&
            orderAmount < coupon.minOrderAmount)
            throw new common_1.BadRequestException('Order amount is less than minimum order amount!');
        return coupon;
    }
    async incrementUsage(payload, session) {
        const coupon = await this.couponModel
            .findOneAndUpdate({
            _id: new mongoose_2.Types.ObjectId(payload.couponId),
            $or: [
                { usageLimit: 0 },
                { $expr: { $lt: ['$usageCount', '$usageLimit'] } },
            ],
        }, { $inc: { usageCount: 1 } }, { session: session || null, new: true });
        if (!coupon) {
            throw new common_1.BadRequestException('Coupon usage limit reached or coupon inactive');
        }
        await this.logUsage(payload, session);
    }
    async handleRefundCouponRestore(payload) {
        if (payload?.couponId && payload?.userId) {
            await this.decrementUsage(payload.couponId.toString(), payload.userId.toString(), payload.orderId?.toString());
        }
    }
    async decrementUsage(couponId, userId, orderId) {
        await this.couponModel.findByIdAndUpdate(couponId, {
            $inc: { usageCount: -1 },
        });
        const query = {
            couponId: new mongoose_2.Types.ObjectId(couponId),
            userId: new mongoose_2.Types.ObjectId(userId),
        };
        if (orderId && mongoose_2.Types.ObjectId.isValid(orderId)) {
            query.orderId = new mongoose_2.Types.ObjectId(orderId);
        }
        await this.couponUsageModel.findOneAndDelete(query);
    }
    async checkUsageLimit(coupon, userId) {
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        const usageCount = await this.couponUsageModel.countDocuments({
            couponId: coupon._id,
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (coupon.usageLimitPerUser > 0 &&
            usageCount >= coupon.usageLimitPerUser) {
            throw new common_1.BadRequestException('You have reached the usage limit for this coupon');
        }
    }
    async logUsage(payload, session) {
        const usage = new this.couponUsageModel({
            couponId: new mongoose_2.Types.ObjectId(payload.couponId),
            userId: new mongoose_2.Types.ObjectId(payload.userId),
            orderId: new mongoose_2.Types.ObjectId(payload.orderId),
            orderCode: payload.orderCode,
            discountAmount: payload.discountAmount,
        });
        await usage.save({ session });
    }
    async getCouponUsageHistory(query) {
        const paginateQueries = (0, helpers_1.pick)(query, constants_1.paginateOptions);
        const { searchTerm, ...remainingFilters } = query;
        const filterQuery = {};
        if (searchTerm) {
            const matchedCoupons = await this.couponModel
                .find({
                $or: [
                    { code: { $regex: searchTerm, $options: 'i' } },
                    { name: { $regex: searchTerm, $options: 'i' } },
                ],
            })
                .select('_id');
            const couponIds = matchedCoupons.map((c) => c._id);
            filterQuery['$or'] = [
                { couponId: { $in: couponIds } },
                { orderCode: { $regex: searchTerm, $options: 'i' } },
            ];
        }
        if (Object.keys(remainingFilters).length) {
            filterQuery['$and'] = Object.entries(remainingFilters).map(([key, value]) => ({
                [key]: value,
            }));
        }
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.couponUsageModel,
            paginationQuery: pagination,
            filterQuery,
            populate: [
                { path: 'couponId', select: 'code name discountType discountValue' },
                { path: 'userId', select: 'fullName email phone' },
                { path: 'orderId', select: 'orderId status' },
            ],
        });
    }
};
exports.CouponService = CouponService;
__decorate([
    (0, event_emitter_1.OnEvent)('refund.coupon.restore'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CouponService.prototype, "handleRefundCouponRestore", null);
exports.CouponService = CouponService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(coupon_schema_1.Coupon.name)),
    __param(1, (0, mongoose_1.InjectModel)(coupon_usage_schema_1.CouponUsage.name)),
    __param(2, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CouponService);
//# sourceMappingURL=coupon.service.js.map