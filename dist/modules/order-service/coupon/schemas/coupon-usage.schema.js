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
exports.CouponUsageSchema = exports.CouponUsage = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CouponUsage = class CouponUsage {
    couponId;
    userId;
    orderId;
    discountAmount;
};
exports.CouponUsage = CouponUsage;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Coupon', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CouponUsage.prototype, "couponId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CouponUsage.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Order', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CouponUsage.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], CouponUsage.prototype, "discountAmount", void 0);
exports.CouponUsage = CouponUsage = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'coupon_usages' })
], CouponUsage);
exports.CouponUsageSchema = mongoose_1.SchemaFactory.createForClass(CouponUsage);
exports.CouponUsageSchema.index({ couponId: 1, userId: 1 });
//# sourceMappingURL=coupon-usage.schema.js.map