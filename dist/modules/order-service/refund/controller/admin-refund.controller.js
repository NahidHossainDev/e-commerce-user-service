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
exports.AdminRefundController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../../common/guards/roles.guard");
const user_schema_1 = require("../../../user-service/user/user.schema");
const refund_dto_1 = require("../dto/refund.dto");
const refund_query_options_dto_1 = require("../dto/refund.query-options.dto");
const refund_service_1 = require("../refund.service");
let AdminRefundController = class AdminRefundController {
    refundService;
    constructor(refundService) {
        this.refundService = refundService;
    }
    findAll(query) {
        return this.refundService.findAll(query);
    }
    findById(id) {
        return this.refundService.findById(id);
    }
    approveOrReject(id, dto, req) {
        return this.refundService.approveOrReject(id, req.user._id, dto);
    }
    processPayment(id, dto, req) {
        return this.refundService.processRefundPayment(id, req.user._id, dto);
    }
    updateStatus(id, dto, req) {
        return this.refundService.updateRefundStatus(id, req.user._id, dto);
    }
    addNote(id, dto, req) {
        return this.refundService.addInternalNote(id, req.user._id, dto);
    }
};
exports.AdminRefundController = AdminRefundController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all refunds (Admin)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refund_query_options_dto_1.RefundQueryOptions]),
    __metadata("design:returntype", void 0)
], AdminRefundController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get refund details (Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminRefundController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id/action'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve or Reject refund (Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, refund_dto_1.AdminRefundActionDto, Object]),
    __metadata("design:returntype", void 0)
], AdminRefundController.prototype, "approveOrReject", null);
__decorate([
    (0, common_1.Post)(':id/process'),
    (0, swagger_1.ApiOperation)({ summary: 'Process refund payment (Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, refund_dto_1.ProcessRefundDto, Object]),
    __metadata("design:returntype", void 0)
], AdminRefundController.prototype, "processPayment", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update refund status manually (Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, refund_dto_1.UpdateRefundStatusDto, Object]),
    __metadata("design:returntype", void 0)
], AdminRefundController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/notes'),
    (0, swagger_1.ApiOperation)({ summary: 'Add internal note to refund (Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, refund_dto_1.AddRefundNoteDto, Object]),
    __metadata("design:returntype", void 0)
], AdminRefundController.prototype, "addNote", null);
exports.AdminRefundController = AdminRefundController = __decorate([
    (0, swagger_1.ApiTags)('Admin / Refunds'),
    (0, common_1.Controller)('admin/refunds'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [refund_service_1.RefundService])
], AdminRefundController);
//# sourceMappingURL=admin-refund.controller.js.map