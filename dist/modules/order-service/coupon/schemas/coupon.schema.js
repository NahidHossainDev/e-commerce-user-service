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
exports.CouponSchema = exports.Coupon = exports.DiscountType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var DiscountType;
(function (DiscountType) {
    DiscountType["PERCENTAGE"] = "PERCENTAGE";
    DiscountType["FIXED_AMOUNT"] = "FIXED_AMOUNT";
    DiscountType["FREE_SHIPPING"] = "FREE_SHIPPING";
})(DiscountType || (exports.DiscountType = DiscountType = {}));
let Coupon = class Coupon {
    _id;
    code;
    name;
    description;
    discountType;
    discountValue;
    maxDiscountAmount;
    minOrderAmount;
    validFrom;
    validTo;
    usageLimit;
    usageCount;
    usageLimitPerUser;
    isActive;
    rules;
};
exports.Coupon = Coupon;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, uppercase: true, trim: true }),
    __metadata("design:type", String)
], Coupon.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Coupon.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Coupon.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: DiscountType }),
    __metadata("design:type", String)
], Coupon.prototype, "discountType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Coupon.prototype, "discountValue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], Coupon.prototype, "maxDiscountAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], Coupon.prototype, "minOrderAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Coupon.prototype, "validFrom", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Coupon.prototype, "validTo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Coupon.prototype, "usageLimit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Coupon.prototype, "usageCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], Coupon.prototype, "usageLimitPerUser", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Coupon.prototype, "rules", void 0);
exports.Coupon = Coupon = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'coupons' })
], Coupon);
exports.CouponSchema = mongoose_1.SchemaFactory.createForClass(Coupon);
//# sourceMappingURL=coupon.schema.js.map