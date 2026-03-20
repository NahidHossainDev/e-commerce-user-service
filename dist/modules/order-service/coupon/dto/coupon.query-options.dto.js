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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponUsageQueryOptions = exports.CouponQueryOptions = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const queryOptions_dto_1 = require("../../../../common/dto/queryOptions.dto");
const coupon_schema_1 = require("../schemas/coupon.schema");
class CouponQueryOptions extends queryOptions_dto_1.QueryOptions {
    searchTerm;
    discountType;
    isActive;
    usageCount;
    validTo;
}
exports.CouponQueryOptions = CouponQueryOptions;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by coupon code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CouponQueryOptions.prototype, "searchTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: coupon_schema_1.DiscountType,
        description: 'Filter by discount type',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(coupon_schema_1.DiscountType),
    __metadata("design:type", String)
], CouponQueryOptions.prototype, "discountType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by active/inactive' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CouponQueryOptions.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort by usage count' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", String)
], CouponQueryOptions.prototype, "usageCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by valid to date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CouponQueryOptions.prototype, "validTo", void 0);
class CouponUsageQueryOptions extends queryOptions_dto_1.QueryOptions {
    searchTerm;
    userId;
    couponId;
    usageCount;
    discountAmount;
}
exports.CouponUsageQueryOptions = CouponUsageQueryOptions;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by coupon code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CouponUsageQueryOptions.prototype, "searchTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by user ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CouponUsageQueryOptions.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by coupon ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CouponUsageQueryOptions.prototype, "couponId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort by usage count' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", String)
], CouponUsageQueryOptions.prototype, "usageCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort by discount amount' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", String)
], CouponUsageQueryOptions.prototype, "discountAmount", void 0);
//# sourceMappingURL=coupon.query-options.dto.js.map