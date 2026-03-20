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
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../../common/constants");
const helpers_1 = require("../../../utils/helpers");
const getPaginatedData_1 = require("../../../utils/mongodb/getPaginatedData");
const coupon_constants_1 = require("./coupon.constants");
const coupon_usage_schema_1 = require("./schemas/coupon-usage.schema");
const coupon_schema_1 = require("./schemas/coupon.schema");
let CouponService = class CouponService {
    couponModel;
    couponUsageModel;
    constructor(couponModel, couponUsageModel) {
        this.couponModel = couponModel;
        this.couponUsageModel = couponUsageModel;
    }
    async create(payload) {
        const existing = await this.couponModel.findOne({
            code: payload?.code?.toUpperCase(),
        });
        if (existing)
            throw new common_1.ConflictException('Coupon code already exists');
        return this.couponModel.create({
            ...payload,
            code: payload?.code?.toUpperCase(),
        });
    }
    async findAll(query) {
        const paginateQueries = (0, helpers_1.pick)(query, constants_1.paginateOptions);
        const { searchTerm, ...remainingFilters } = query;
        const filterQuery = {};
        if (searchTerm) {
            filterQuery['$or'] = coupon_constants_1.couponSearchableFields.map((field) => ({
                [field]: { $regex: searchTerm, $options: 'i' },
            }));
        }
        if (Object.keys(remainingFilters).length) {
            filterQuery['$and'] = Object.entries(remainingFilters).map(([key, value]) => ({
                [key]: value,
            }));
        }
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
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
        const updated = await this.couponModel.findByIdAndUpdate(id, dto, {
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
        if (userId &&
            coupon.usageLimitPerUser > 0 &&
            coupon.usageCount >= coupon.usageLimitPerUser)
            throw new common_1.BadRequestException('Coupon usage limit per user reached!');
        if (userId) {
            await this.checkUsageLimit(coupon, userId);
        }
        if (orderAmount && orderAmount < coupon.minOrderAmount)
            throw new common_1.BadRequestException('Order amount is less than minimum order amount!');
        return coupon;
    }
    async incrementUsage(payload, session) {
        await this.couponModel
            .findByIdAndUpdate(payload.couponId, { $inc: { usageCount: 1 } })
            .session(session || null);
        await this.logUsage(payload, session);
    }
    async checkUsageLimit(coupon, userId) {
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        const usageCount = await this.couponUsageModel.countDocuments({
            couponId: coupon._id,
            userId,
        });
        if (coupon.usageLimitPerUser > 0 &&
            usageCount >= coupon.usageLimitPerUser) {
            throw new common_1.BadRequestException('You have reached the usage limit for this coupon');
        }
    }
    async logUsage(payload, session) {
        const usage = new this.couponUsageModel(payload);
        await usage.save({ session });
    }
    async getCouponUsageHistory(query) {
        const paginateQueries = (0, helpers_1.pick)(query, constants_1.paginateOptions);
        const { searchTerm, ...remainingFilters } = query;
        const filterQuery = {};
        if (searchTerm) {
            filterQuery['$or'] = coupon_constants_1.couponSearchableFields.map((field) => ({
                [field]: { $regex: searchTerm, $options: 'i' },
            }));
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
        });
    }
};
exports.CouponService = CouponService;
exports.CouponService = CouponService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(coupon_schema_1.Coupon.name)),
    __param(1, (0, mongoose_1.InjectModel)(coupon_usage_schema_1.CouponUsage.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CouponService);
//# sourceMappingURL=coupon.service.js.map