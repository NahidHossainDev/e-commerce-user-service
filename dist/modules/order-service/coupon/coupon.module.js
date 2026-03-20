"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const controller_1 = require("./controller");
const coupon_service_1 = require("./coupon.service");
const coupon_usage_schema_1 = require("./schemas/coupon-usage.schema");
const coupon_schema_1 = require("./schemas/coupon.schema");
let CouponModule = class CouponModule {
};
exports.CouponModule = CouponModule;
exports.CouponModule = CouponModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: coupon_schema_1.Coupon.name, schema: coupon_schema_1.CouponSchema },
                { name: coupon_usage_schema_1.CouponUsage.name, schema: coupon_usage_schema_1.CouponUsageSchema },
            ]),
        ],
        controllers: [controller_1.AdminCouponController, controller_1.CouponController],
        providers: [coupon_service_1.CouponService],
        exports: [coupon_service_1.CouponService],
    })
], CouponModule);
//# sourceMappingURL=coupon.module.js.map