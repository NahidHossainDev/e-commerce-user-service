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
exports.BalanceAdjustmentDto = exports.AdminWalletQueryDto = exports.WalletTransactionQueryDto = exports.TopUpRequestDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const queryOptions_dto_1 = require("../../../../common/dto/queryOptions.dto");
const interface_1 = require("../../../../common/interface");
const wallet_interface_1 = require("../interface/wallet.interface");
class TopUpRequestDto {
    amount;
    method;
    description;
}
exports.TopUpRequestDto = TopUpRequestDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], TopUpRequestDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(interface_1.PaymentMethod),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TopUpRequestDto.prototype, "method", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TopUpRequestDto.prototype, "description", void 0);
class WalletTransactionQueryDto extends queryOptions_dto_1.QueryOptions {
    type;
    balanceType;
    isSuccessOnly;
    searchTerm;
}
exports.WalletTransactionQueryDto = WalletTransactionQueryDto;
__decorate([
    (0, class_validator_1.IsEnum)(wallet_interface_1.WalletTransactionType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WalletTransactionQueryDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(wallet_interface_1.WalletBalanceType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WalletTransactionQueryDto.prototype, "balanceType", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], WalletTransactionQueryDto.prototype, "isSuccessOnly", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WalletTransactionQueryDto.prototype, "searchTerm", void 0);
class AdminWalletQueryDto extends queryOptions_dto_1.QueryOptions {
    searchTerm;
    status;
}
exports.AdminWalletQueryDto = AdminWalletQueryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdminWalletQueryDto.prototype, "searchTerm", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(wallet_interface_1.WalletStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdminWalletQueryDto.prototype, "status", void 0);
class BalanceAdjustmentDto {
    amount;
    type;
    balanceType;
    reason;
}
exports.BalanceAdjustmentDto = BalanceAdjustmentDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], BalanceAdjustmentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(wallet_interface_1.WalletTransactionType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BalanceAdjustmentDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(wallet_interface_1.WalletBalanceType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BalanceAdjustmentDto.prototype, "balanceType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BalanceAdjustmentDto.prototype, "reason", void 0);
//# sourceMappingURL=wallet.dto.js.map