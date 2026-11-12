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
exports.AdminNotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../../../common/decorators");
const roles_decorator_1 = require("../../../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../../common/guards/roles.guard");
const interface_1 = require("../../../../common/interface");
const dto_1 = require("../dto");
const notification_service_1 = require("../notification.service");
let AdminNotificationController = class AdminNotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    sendNotification(user, dto) {
        return this.notificationService.adminSendNotification(dto, user._id.toString());
    }
    findAll(query) {
        return this.notificationService.adminFindAll(query);
    }
    getStats() {
        return this.notificationService.adminGetStats();
    }
    delete(id) {
        return this.notificationService.adminDelete(id);
    }
};
exports.AdminNotificationController = AdminNotificationController;
__decorate([
    (0, common_1.Post)('send'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send marketing or broadcast notification to users (all, specific, or user group)',
    }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AdminSendNotificationDto]),
    __metadata("design:returntype", void 0)
], AdminNotificationController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all notifications with filtering (Admin)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AdminNotificationQueryDto]),
    __metadata("design:returntype", void 0)
], AdminNotificationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get notification overview statistics (Admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminNotificationController.prototype, "getStats", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a notification (Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminNotificationController.prototype, "delete", null);
exports.AdminNotificationController = AdminNotificationController = __decorate([
    (0, swagger_1.ApiTags)('Admin Notifications'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(interface_1.UserRole.ADMIN, interface_1.UserRole.SUPER_ADMIN),
    (0, common_1.Controller)('admin/notifications'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], AdminNotificationController);
//# sourceMappingURL=admin-notification.controller.js.map