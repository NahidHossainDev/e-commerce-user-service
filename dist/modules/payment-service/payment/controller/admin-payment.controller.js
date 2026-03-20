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
exports.AdminPaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../../common/guards/roles.guard");
const interface_1 = require("../../../../common/interface");
const payment_query_options_dto_1 = require("../dto/payment.query-options.dto");
const update_payment_status_dto_1 = require("../dto/update-payment-status.dto");
const payment_service_1 = require("../payment.service");
let AdminPaymentController = class AdminPaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    getStats() {
        return this.paymentService.getPaymentStats();
    }
    findAll(query) {
        return this.paymentService.findAll(query);
    }
    findOne(id) {
        return this.paymentService.findOne(id);
    }
    updateStatus(id, dto) {
        return this.paymentService.manualUpdateStatus(id, dto);
    }
    initiateRefund(id, body) {
        return this.paymentService.initiateRefund(id, body.amount, body.reason);
    }
};
exports.AdminPaymentController = AdminPaymentController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminPaymentController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Find all payments' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_query_options_dto_1.PaymentQueryOptions]),
    __metadata("design:returntype", void 0)
], AdminPaymentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Find one payment by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminPaymentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('status/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually update payment status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_payment_status_dto_1.UpdatePaymentStatusDto]),
    __metadata("design:returntype", void 0)
], AdminPaymentController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/refund'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate refund' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminPaymentController.prototype, "initiateRefund", null);
exports.AdminPaymentController = AdminPaymentController = __decorate([
    (0, swagger_1.ApiTags)('Admin Payments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(interface_1.UserRole.ADMIN, interface_1.UserRole.SUPER_ADMIN),
    (0, common_1.Controller)('admin/payments'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], AdminPaymentController);
//# sourceMappingURL=admin-payment.controller.js.map