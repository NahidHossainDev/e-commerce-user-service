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
exports.RefundSchema = exports.Refund = exports.PaymentGatewayResponse = exports.AdminAction = exports.RefundTimeline = exports.RefundEvidence = exports.RefundAmount = exports.RefundItem = exports.RefundMethod = exports.RefundReason = exports.RefundType = exports.RefundStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var RefundStatus;
(function (RefundStatus) {
    RefundStatus["REQUESTED"] = "REQUESTED";
    RefundStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    RefundStatus["APPROVED"] = "APPROVED";
    RefundStatus["REJECTED"] = "REJECTED";
    RefundStatus["PROCESSING"] = "PROCESSING";
    RefundStatus["COMPLETED"] = "COMPLETED";
    RefundStatus["FAILED"] = "FAILED";
    RefundStatus["CANCELLED"] = "CANCELLED";
})(RefundStatus || (exports.RefundStatus = RefundStatus = {}));
var RefundType;
(function (RefundType) {
    RefundType["FULL"] = "FULL";
    RefundType["PARTIAL"] = "PARTIAL";
    RefundType["SHIPPING"] = "SHIPPING";
})(RefundType || (exports.RefundType = RefundType = {}));
var RefundReason;
(function (RefundReason) {
    RefundReason["DAMAGED_PRODUCT"] = "DAMAGED_PRODUCT";
    RefundReason["WRONG_ITEM"] = "WRONG_ITEM";
    RefundReason["DEFECTIVE_PRODUCT"] = "DEFECTIVE_PRODUCT";
    RefundReason["NOT_AS_DESCRIBED"] = "NOT_AS_DESCRIBED";
    RefundReason["QUALITY_ISSUE"] = "QUALITY_ISSUE";
    RefundReason["SIZE_FIT_ISSUE"] = "SIZE_FIT_ISSUE";
    RefundReason["LATE_DELIVERY"] = "LATE_DELIVERY";
    RefundReason["CUSTOMER_CHANGED_MIND"] = "CUSTOMER_CHANGED_MIND";
    RefundReason["DUPLICATE_ORDER"] = "DUPLICATE_ORDER";
    RefundReason["FRAUDULENT_ORDER"] = "FRAUDULENT_ORDER";
    RefundReason["OTHER"] = "OTHER";
})(RefundReason || (exports.RefundReason = RefundReason = {}));
var RefundMethod;
(function (RefundMethod) {
    RefundMethod["ORIGINAL_PAYMENT"] = "ORIGINAL_PAYMENT";
    RefundMethod["WALLET"] = "WALLET";
    RefundMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    RefundMethod["STORE_CREDIT"] = "STORE_CREDIT";
})(RefundMethod || (exports.RefundMethod = RefundMethod = {}));
let RefundItem = class RefundItem {
    productId;
    name;
    variantSku;
    quantity;
    unitPrice;
    totalAmount;
    reason;
};
exports.RefundItem = RefundItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Product', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], RefundItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], RefundItem.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RefundItem.prototype, "variantSku", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], RefundItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], RefundItem.prototype, "unitPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], RefundItem.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RefundItem.prototype, "reason", void 0);
exports.RefundItem = RefundItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], RefundItem);
let RefundAmount = class RefundAmount {
    itemsTotal;
    shippingRefund;
    taxRefund;
    couponRefund;
    walletRefund;
    processingFee;
    restockingFee;
    totalRefundAmount;
    currency;
};
exports.RefundAmount = RefundAmount;
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], RefundAmount.prototype, "itemsTotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], RefundAmount.prototype, "shippingRefund", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], RefundAmount.prototype, "taxRefund", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], RefundAmount.prototype, "couponRefund", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], RefundAmount.prototype, "walletRefund", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], RefundAmount.prototype, "processingFee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], RefundAmount.prototype, "restockingFee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], RefundAmount.prototype, "totalRefundAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'BDT' }),
    __metadata("design:type", String)
], RefundAmount.prototype, "currency", void 0);
exports.RefundAmount = RefundAmount = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], RefundAmount);
let RefundEvidence = class RefundEvidence {
    images;
    videos;
    description;
    documents;
};
exports.RefundEvidence = RefundEvidence;
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], RefundEvidence.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], RefundEvidence.prototype, "videos", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RefundEvidence.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], RefundEvidence.prototype, "documents", void 0);
exports.RefundEvidence = RefundEvidence = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], RefundEvidence);
let RefundTimeline = class RefundTimeline {
    requestedAt;
    approvedAt;
    rejectedAt;
    processingStartedAt;
    completedAt;
    failedAt;
    cancelledAt;
};
exports.RefundTimeline = RefundTimeline;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], RefundTimeline.prototype, "requestedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], RefundTimeline.prototype, "approvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], RefundTimeline.prototype, "rejectedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], RefundTimeline.prototype, "processingStartedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], RefundTimeline.prototype, "completedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], RefundTimeline.prototype, "failedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], RefundTimeline.prototype, "cancelledAt", void 0);
exports.RefundTimeline = RefundTimeline = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], RefundTimeline);
let AdminAction = class AdminAction {
    adminId;
    action;
    note;
    timestamp;
};
exports.AdminAction = AdminAction;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AdminAction.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AdminAction.prototype, "action", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AdminAction.prototype, "note", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now }),
    __metadata("design:type", Date)
], AdminAction.prototype, "timestamp", void 0);
exports.AdminAction = AdminAction = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], AdminAction);
let PaymentGatewayResponse = class PaymentGatewayResponse {
    gateway;
    transactionId;
    refundId;
    status;
    rawResponse;
    timestamp;
};
exports.PaymentGatewayResponse = PaymentGatewayResponse;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PaymentGatewayResponse.prototype, "gateway", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PaymentGatewayResponse.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PaymentGatewayResponse.prototype, "refundId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PaymentGatewayResponse.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], PaymentGatewayResponse.prototype, "rawResponse", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], PaymentGatewayResponse.prototype, "timestamp", void 0);
exports.PaymentGatewayResponse = PaymentGatewayResponse = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PaymentGatewayResponse);
let Refund = class Refund {
    refundId;
    orderId;
    orderNumber;
    userId;
    refundType;
    status;
    reason;
    reasonDetails;
    items;
    refundAmount;
    refundMethod;
    evidence;
    timeline;
    adminActions;
    paymentGatewayResponse;
    rejectionReason;
    failureReason;
    isStockRestored;
    stockRestoredAt;
    isCouponRestored;
    couponRestoredAt;
    metadata;
    internalNotes;
};
exports.Refund = Refund;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Refund.prototype, "refundId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Order', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Refund.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Refund.prototype, "orderNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Refund.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: RefundType,
        default: RefundType.FULL,
    }),
    __metadata("design:type", String)
], Refund.prototype, "refundType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: RefundStatus,
        default: RefundStatus.REQUESTED,
        index: true,
    }),
    __metadata("design:type", String)
], Refund.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: RefundReason,
    }),
    __metadata("design:type", String)
], Refund.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Refund.prototype, "reasonDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [RefundItem] }),
    __metadata("design:type", Array)
], Refund.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: RefundAmount }),
    __metadata("design:type", RefundAmount)
], Refund.prototype, "refundAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: RefundMethod,
        default: RefundMethod.ORIGINAL_PAYMENT,
    }),
    __metadata("design:type", String)
], Refund.prototype, "refundMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: RefundEvidence }),
    __metadata("design:type", RefundEvidence)
], Refund.prototype, "evidence", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: RefundTimeline, required: true }),
    __metadata("design:type", RefundTimeline)
], Refund.prototype, "timeline", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [AdminAction], default: [] }),
    __metadata("design:type", Array)
], Refund.prototype, "adminActions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PaymentGatewayResponse }),
    __metadata("design:type", PaymentGatewayResponse)
], Refund.prototype, "paymentGatewayResponse", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Refund.prototype, "rejectionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Refund.prototype, "failureReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Refund.prototype, "isStockRestored", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Refund.prototype, "stockRestoredAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Refund.prototype, "isCouponRestored", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Refund.prototype, "couponRestoredAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Refund.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Refund.prototype, "internalNotes", void 0);
exports.Refund = Refund = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'refunds' })
], Refund);
exports.RefundSchema = mongoose_1.SchemaFactory.createForClass(Refund);
exports.RefundSchema.index({ createdAt: -1 });
exports.RefundSchema.index({ refundId: 1 }, { unique: true });
exports.RefundSchema.index({ orderId: 1, status: 1 });
exports.RefundSchema.index({ userId: 1, status: 1 });
exports.RefundSchema.index({ status: 1, createdAt: -1 });
exports.RefundSchema.index({ 'timeline.requestedAt': -1 });
//# sourceMappingURL=refund.schema.js.map