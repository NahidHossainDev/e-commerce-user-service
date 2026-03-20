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
exports.RefundController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../../common/guards/jwt-auth.guard");
const refund_dto_1 = require("../dto/refund.dto");
const refund_query_options_dto_1 = require("../dto/refund.query-options.dto");
const refund_service_1 = require("../refund.service");
let RefundController = class RefundController {
    refundService;
    constructor(refundService) {
        this.refundService = refundService;
    }
    create(dto, req) {
        return this.refundService.createRefundRequest(req.user._id, dto);
    }
    findAllByUser(query, req) {
        return this.refundService.findAllByUser(req.user._id, query);
    }
    findById(id, req) {
        return this.refundService.findById(id, req.user._id);
    }
    cancel(id, dto, req) {
        return this.refundService.cancelRefund(id, req.user._id, dto);
    }
};
exports.RefundController = RefundController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new refund request (Customer)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refund_dto_1.CreateRefundRequestDto, Object]),
    __metadata("design:returntype", void 0)
], RefundController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all refunds for current user' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refund_query_options_dto_1.RefundQueryOptions, Object]),
    __metadata("design:returntype", void 0)
], RefundController.prototype, "findAllByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get refund details' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RefundController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a refund request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, refund_dto_1.CancelRefundRequestDto, Object]),
    __metadata("design:returntype", void 0)
], RefundController.prototype, "cancel", null);
exports.RefundController = RefundController = __decorate([
    (0, swagger_1.ApiTags)('Private / Refunds'),
    (0, common_1.Controller)('refunds'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [refund_service_1.RefundService])
], RefundController);
//# sourceMappingURL=refund.controller.js.map