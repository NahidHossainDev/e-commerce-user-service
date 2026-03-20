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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../../../common/decorators");
const jwt_auth_guard_1 = require("../../../../common/guards/jwt-auth.guard");
const initiate_payment_dto_1 = require("../dto/initiate-payment.dto");
const payment_query_options_dto_1 = require("../dto/payment.query-options.dto");
const payment_service_1 = require("../payment.service");
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    initiate(user, dto) {
        if (dto.userId !== user.id) {
            dto.userId = user.id;
        }
        return this.paymentService.initiatePayment(dto);
    }
    handleSSLCommerzCallback(payload) {
        return this.paymentService.handleSSLCommerzCallback(payload);
    }
    getMyPayments(user, query) {
        return this.paymentService.getMyPayments(user.id, query);
    }
    verifyPayment(transactionId) {
        return this.paymentService.verifyPayment(transactionId);
    }
    getPayment(user, transactionId) {
        return this.paymentService.getPaymentByTransactionId(transactionId, user.id);
    }
    getAvailablePaymentMethods() {
        return this.paymentService.getAvailablePaymentMethods();
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('initiate'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate a payment' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, initiate_payment_dto_1.InitiatePaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "initiate", null);
__decorate([
    (0, common_1.Post)('sslcommerz/callback'),
    (0, swagger_1.ApiOperation)({ summary: 'SSLCommerz Callback URL (Public)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "handleSSLCommerzCallback", null);
__decorate([
    (0, common_1.Get)('my-payments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user payments' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payment_query_options_dto_1.PaymentQueryOptions]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "getMyPayments", null);
__decorate([
    (0, common_1.Post)('verify/:transactionId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Verify payment status manually' }),
    __param(0, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Get)(':transactionId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment by transaction ID' }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "getPayment", null);
__decorate([
    (0, common_1.Get)('available-payment-methods'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available payment methods' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "getAvailablePaymentMethods", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map