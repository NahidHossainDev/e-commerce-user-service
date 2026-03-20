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
exports.OrderSchema = exports.Order = exports.BillingInfo = exports.OrderItem = exports.PaymentStatus = exports.PaymentMethod = exports.OrderStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const interface_1 = require("../../../../common/interface");
Object.defineProperty(exports, "OrderStatus", { enumerable: true, get: function () { return interface_1.OrderStatus; } });
Object.defineProperty(exports, "PaymentMethod", { enumerable: true, get: function () { return interface_1.PaymentMethod; } });
Object.defineProperty(exports, "PaymentStatus", { enumerable: true, get: function () { return interface_1.PaymentStatus; } });
const schemas_1 = require("../../../../common/schemas");
let OrderItem = class OrderItem {
    productId;
    name;
    thumbnail;
    variantSku;
    quantity;
    price;
    total;
};
exports.OrderItem = OrderItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Product', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OrderItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OrderItem.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], OrderItem.prototype, "thumbnail", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OrderItem.prototype, "variantSku", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: schemas_1.Price }),
    __metadata("design:type", schemas_1.Price)
], OrderItem.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "total", void 0);
exports.OrderItem = OrderItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], OrderItem);
let BillingInfo = class BillingInfo {
    totalAmount;
    discount;
    appliedCouponId;
    couponDiscount;
    deliveryCharge;
    payableAmount;
    walletUsed;
    cashbackUsed;
    paymentMethod;
    paymentStatus;
    paymentTransactionId;
    paymentFailureReason;
    paymentAttempt;
};
exports.BillingInfo = BillingInfo;
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], BillingInfo.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BillingInfo.prototype, "discount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Coupon', required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BillingInfo.prototype, "appliedCouponId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BillingInfo.prototype, "couponDiscount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BillingInfo.prototype, "deliveryCharge", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], BillingInfo.prototype, "payableAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BillingInfo.prototype, "walletUsed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BillingInfo.prototype, "cashbackUsed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: interface_1.PaymentMethod, required: false }),
    __metadata("design:type", String)
], BillingInfo.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: interface_1.PaymentStatus.PENDING, enum: interface_1.PaymentStatus }),
    __metadata("design:type", String)
], BillingInfo.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BillingInfo.prototype, "paymentTransactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BillingInfo.prototype, "paymentFailureReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BillingInfo.prototype, "paymentAttempt", void 0);
exports.BillingInfo = BillingInfo = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], BillingInfo);
let Order = class Order {
    orderId;
    userId;
    items;
    addressId;
    status;
    billingInfo;
    placedAt;
    confirmedAt;
    shippedAt;
    deliveredAt;
    cancelledAt;
    cancellationReason;
    hasRefund;
    refundIds;
    totalRefundedAmount;
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Order.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [OrderItem], required: true }),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'Address' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Order.prototype, "addressId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: interface_1.OrderStatus,
        default: interface_1.OrderStatus.PENDING,
        index: true,
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", BillingInfo)
], Order.prototype, "billingInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Order.prototype, "placedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Order.prototype, "confirmedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Order.prototype, "shippedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Order.prototype, "deliveredAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Order.prototype, "cancelledAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Order.prototype, "cancellationReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "hasRefund", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Refund' }], default: [] }),
    __metadata("design:type", Array)
], Order.prototype, "refundIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "totalRefundedAmount", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'orders' })
], Order);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
exports.OrderSchema.index({ createdAt: -1 });
exports.OrderSchema.index({ orderId: 1 }, { unique: true });
//# sourceMappingURL=order.schema.js.map