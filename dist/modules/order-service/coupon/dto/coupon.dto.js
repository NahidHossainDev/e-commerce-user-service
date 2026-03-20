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
exports.CouponValidationDto = exports.CreateCouponDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const coupon_schema_1 = require("../schemas/coupon.schema");
class CreateCouponDto {
    code;
    name;
    description;
    isActive;
    discountType;
    discountValue;
    maxDiscountAmount;
    validFrom;
    validTo;
    usageLimit;
    usageLimitPerUser;
}
exports.CreateCouponDto = CreateCouponDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: [true, false] }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCouponDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: coupon_schema_1.DiscountType }),
    (0, class_validator_1.IsEnum)(coupon_schema_1.DiscountType),
    __metadata("design:type", String)
], CreateCouponDto.prototype, "discountType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCouponDto.prototype, "discountValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCouponDto.prototype, "maxDiscountAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateCouponDto.prototype, "validFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateCouponDto.prototype, "validTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCouponDto.prototype, "usageLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCouponDto.prototype, "usageLimitPerUser", void 0);
class CouponValidationDto {
    code;
    couponId;
    userId;
    orderAmount;
}
exports.CouponValidationDto = CouponValidationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CouponValidationDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CouponValidationDto.prototype, "couponId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CouponValidationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CouponValidationDto.prototype, "orderAmount", void 0);
//# sourceMappingURL=coupon.dto.js.map