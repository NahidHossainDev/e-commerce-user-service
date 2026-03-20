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
exports.CancelOrderDto = exports.UpdatePaymentStatusDto = exports.UpdateOrderStatusDto = exports.CheckoutDto = exports.ApplyCouponDto = exports.PaymentIntentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const order_schema_1 = require("../schemas/order.schema");
class PaymentIntentDto {
    method;
    useWallet;
    useCashback;
}
exports.PaymentIntentDto = PaymentIntentDto;
__decorate([
    (0, class_validator_1.IsEnum)(order_schema_1.PaymentMethod),
    __metadata("design:type", String)
], PaymentIntentDto.prototype, "method", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PaymentIntentDto.prototype, "useWallet", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PaymentIntentDto.prototype, "useCashback", void 0);
class ApplyCouponDto {
    code;
}
exports.ApplyCouponDto = ApplyCouponDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ApplyCouponDto.prototype, "code", void 0);
class CheckoutDto {
    addressId;
    paymentIntent;
    couponId;
    note;
}
exports.CheckoutDto = CheckoutDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "addressId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Type)(() => PaymentIntentDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", PaymentIntentDto)
], CheckoutDto.prototype, "paymentIntent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "couponId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "note", void 0);
class UpdateOrderStatusDto {
    status;
    reason;
}
exports.UpdateOrderStatusDto = UpdateOrderStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: order_schema_1.OrderStatus }),
    (0, class_validator_1.IsEnum)(order_schema_1.OrderStatus),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "reason", void 0);
class UpdatePaymentStatusDto {
    status;
    transactionId;
    failureReason;
}
exports.UpdatePaymentStatusDto = UpdatePaymentStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: order_schema_1.PaymentStatus }),
    (0, class_validator_1.IsEnum)(order_schema_1.PaymentStatus),
    __metadata("design:type", String)
], UpdatePaymentStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePaymentStatusDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePaymentStatusDto.prototype, "failureReason", void 0);
class CancelOrderDto {
    reason;
}
exports.CancelOrderDto = CancelOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CancelOrderDto.prototype, "reason", void 0);
//# sourceMappingURL=order.dto.js.map