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
exports.CalculateDeliveryFeeDto = exports.UpdateGlobalDeliveryConfigDto = exports.UpdateDeliveryZoneDto = exports.CreateDeliveryZoneDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const delivery_config_schema_1 = require("../schemas/delivery-config.schema");
class CreateDeliveryZoneDto {
    name;
    code;
    deliveryFee;
    isDefault;
    isActive;
    matchedCities;
    freeDeliveryPolicy;
    minOrderForFreeDelivery;
    estimatedDays;
}
exports.CreateDeliveryZoneDto = CreateDeliveryZoneDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Inside Dhaka' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryZoneDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'INSIDE_DHAKA' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryZoneDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 70 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDeliveryZoneDto.prototype, "deliveryFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDeliveryZoneDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateDeliveryZoneDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['Dhaka', 'Gazipur', 'Savar', 'Narayanganj'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateDeliveryZoneDto.prototype, "matchedCities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: delivery_config_schema_1.FreeDeliveryPolicy, default: delivery_config_schema_1.FreeDeliveryPolicy.NONE }),
    (0, class_validator_1.IsEnum)(delivery_config_schema_1.FreeDeliveryPolicy),
    __metadata("design:type", String)
], CreateDeliveryZoneDto.prototype, "freeDeliveryPolicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 800 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDeliveryZoneDto.prototype, "minOrderForFreeDelivery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1-2 Days' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeliveryZoneDto.prototype, "estimatedDays", void 0);
class UpdateDeliveryZoneDto {
    name;
    code;
    deliveryFee;
    isDefault;
    isActive;
    matchedCities;
    freeDeliveryPolicy;
    minOrderForFreeDelivery;
    estimatedDays;
}
exports.UpdateDeliveryZoneDto = UpdateDeliveryZoneDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeliveryZoneDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeliveryZoneDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateDeliveryZoneDto.prototype, "deliveryFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateDeliveryZoneDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateDeliveryZoneDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateDeliveryZoneDto.prototype, "matchedCities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: delivery_config_schema_1.FreeDeliveryPolicy }),
    (0, class_validator_1.IsEnum)(delivery_config_schema_1.FreeDeliveryPolicy),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeliveryZoneDto.prototype, "freeDeliveryPolicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDeliveryZoneDto.prototype, "minOrderForFreeDelivery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeliveryZoneDto.prototype, "estimatedDays", void 0);
class UpdateGlobalDeliveryConfigDto {
    defaultFee;
    enableGlobalFreeDelivery;
    globalFreeDeliveryMinOrder;
}
exports.UpdateGlobalDeliveryConfigDto = UpdateGlobalDeliveryConfigDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 60 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateGlobalDeliveryConfigDto.prototype, "defaultFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateGlobalDeliveryConfigDto.prototype, "enableGlobalFreeDelivery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateGlobalDeliveryConfigDto.prototype, "globalFreeDeliveryMinOrder", void 0);
class CalculateDeliveryFeeDto {
    subTotal;
    city;
    couponCode;
}
exports.CalculateDeliveryFeeDto = CalculateDeliveryFeeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 650 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CalculateDeliveryFeeDto.prototype, "subTotal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Dhaka' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CalculateDeliveryFeeDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'COUPON_FREE' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CalculateDeliveryFeeDto.prototype, "couponCode", void 0);
//# sourceMappingURL=delivery-config.dto.js.map