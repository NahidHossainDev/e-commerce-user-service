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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCouponController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../../common/guards/roles.guard");
const user_schema_1 = require("../../../user-service/user/user.schema");
const coupon_service_1 = require("../coupon.service");
const coupon_dto_1 = require("../dto/coupon.dto");
const coupon_query_options_dto_1 = require("../dto/coupon.query-options.dto");
let AdminCouponController = class AdminCouponController {
    couponService;
    constructor(couponService) {
        this.couponService = couponService;
    }
    create(dto) {
        return this.couponService.create(dto);
    }
    findAll(query) {
        return this.couponService.findAll(query);
    }
    findById(id) {
        return this.couponService.findById(id);
    }
    update(id, dto) {
        return this.couponService.update(id, dto);
    }
    delete(id) {
        return this.couponService.delete(id);
    }
    toggle(id) {
        return this.couponService.toggle(id);
    }
    getCouponUsageHistory(query) {
        return this.couponService.getCouponUsageHistory(query);
    }
};
exports.AdminCouponController = AdminCouponController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new coupon (Admin)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coupon_dto_1.CreateCouponDto]),
    __metadata("design:returntype", void 0)
], AdminCouponController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all coupons (Admin)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coupon_query_options_dto_1.CouponQueryOptions]),
    __metadata("design:returntype", void 0)
], AdminCouponController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminCouponController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, coupon_dto_1.CreateCouponDto]),
    __metadata("design:returntype", void 0)
], AdminCouponController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminCouponController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':id/toggle'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminCouponController.prototype, "toggle", null);
__decorate([
    (0, common_1.Get)('usage-history'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coupon_query_options_dto_1.CouponUsageQueryOptions]),
    __metadata("design:returntype", void 0)
], AdminCouponController.prototype, "getCouponUsageHistory", null);
exports.AdminCouponController = AdminCouponController = __decorate([
    (0, swagger_1.ApiTags)('Admin / Coupons'),
    (0, common_1.Controller)('admin/coupons'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [coupon_service_1.CouponService])
], AdminCouponController);
//# sourceMappingURL=admin-coupon.controller.js.map