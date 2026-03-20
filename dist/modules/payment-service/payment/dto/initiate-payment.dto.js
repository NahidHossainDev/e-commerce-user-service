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
exports.InitiatePaymentDto = void 0;
const class_validator_1 = require("class-validator");
const interface_1 = require("../../../../common/interface");
class InitiatePaymentDto {
    userId;
    orderId;
    amount;
    paymentMethod;
    currency;
    metadata;
}
exports.InitiatePaymentDto = InitiatePaymentDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitiatePaymentDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitiatePaymentDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], InitiatePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(interface_1.PaymentMethod),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], InitiatePaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitiatePaymentDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], InitiatePaymentDto.prototype, "metadata", void 0);
//# sourceMappingURL=initiate-payment.dto.js.map