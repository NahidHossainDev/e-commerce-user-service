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
exports.WalletTransactionSchema = exports.WalletTransaction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const interface_1 = require("../../../../common/interface");
const wallet_interface_1 = require("../interface/wallet.interface");
let WalletTransaction = class WalletTransaction {
    walletId;
    userId;
    transactionId;
    amount;
    type;
    source;
    balanceType;
    status;
    description;
    referenceId;
    metadata;
};
exports.WalletTransaction = WalletTransaction;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Wallet', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], WalletTransaction.prototype, "walletId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], WalletTransaction.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], WalletTransaction.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: wallet_interface_1.WalletTransactionType,
        index: true,
    }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: wallet_interface_1.WalletTransactionSource,
        index: true,
    }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: wallet_interface_1.WalletBalanceType,
        index: true,
    }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "balanceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: interface_1.PaymentStatus,
        default: interface_1.PaymentStatus.PENDING,
        index: true,
    }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WalletTransaction.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WalletTransaction.prototype, "referenceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], WalletTransaction.prototype, "metadata", void 0);
exports.WalletTransaction = WalletTransaction = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'wallet_transactions' })
], WalletTransaction);
exports.WalletTransactionSchema = mongoose_1.SchemaFactory.createForClass(WalletTransaction);
exports.WalletTransactionSchema.index({ createdAt: -1 });
exports.WalletTransactionSchema.index({ userId: 1, type: 1, status: 1 });
//# sourceMappingURL=wallet-transaction.schema.js.map