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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../../../common/decorators");
const jwt_auth_guard_1 = require("../../../../common/guards/jwt-auth.guard");
const order_dto_1 = require("../dto/order.dto");
const order_query_options_dto_1 = require("../dto/order.query-options.dto");
const order_service_1 = require("../order.service");
let OrderController = class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    checkout(user, dto) {
        return this.orderService.checkout(user.id, dto);
    }
    findAll(user, query) {
        return this.orderService.findAllByUser(user.id, query);
    }
    findOne(user, orderId) {
        return this.orderService.getOrderByOrderId(user.id, orderId);
    }
    applyCoupon(user, dto) {
        return this.orderService.applyCoupon(user.id, dto);
    }
    removeCoupon(user) {
        return this.orderService.removeCoupon(user.id);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)('checkout'),
    (0, swagger_1.ApiOperation)({ summary: 'Place an order' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, order_dto_1.CheckoutDto]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "checkout", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders for the current user' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, order_query_options_dto_1.OrderQueryOptions]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':orderId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order details by order ID' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('apply-coupon'),
    (0, swagger_1.ApiOperation)({ summary: 'Apply a coupon and preview billing' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, order_dto_1.ApplyCouponDto]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "applyCoupon", null);
__decorate([
    (0, common_1.Post)('remove-coupon'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove applied coupon and preview billing' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "removeCoupon", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map