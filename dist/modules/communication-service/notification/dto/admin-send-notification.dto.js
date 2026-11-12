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
exports.AdminSendNotificationDto = exports.NotificationTargetType = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const interface_1 = require("../../../../common/interface");
const notification_interface_1 = require("../interfaces/notification.interface");
var NotificationTargetType;
(function (NotificationTargetType) {
    NotificationTargetType["ALL"] = "ALL";
    NotificationTargetType["SPECIFIC_USERS"] = "SPECIFIC_USERS";
    NotificationTargetType["USER_GROUP"] = "USER_GROUP";
})(NotificationTargetType || (exports.NotificationTargetType = NotificationTargetType = {}));
class AdminSendNotificationDto {
    targetType;
    userIds;
    userGroup;
    title;
    message;
    type = notification_interface_1.NotificationType.MARKETING;
    category = notification_interface_1.NotificationCategory.MARKETING;
    data;
    channels = [notification_interface_1.NotificationChannel.IN_APP];
}
exports.AdminSendNotificationDto = AdminSendNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: NotificationTargetType,
        description: 'Target audience type',
        example: NotificationTargetType.ALL,
    }),
    (0, class_validator_1.IsEnum)(NotificationTargetType),
    __metadata("design:type", String)
], AdminSendNotificationDto.prototype, "targetType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of target user IDs (required when targetType is SPECIFIC_USERS)',
        type: [String],
        example: ['65b2a1e0...'],
    }),
    (0, class_validator_1.ValidateIf)((o) => o.targetType === NotificationTargetType.SPECIFIC_USERS),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AdminSendNotificationDto.prototype, "userIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: interface_1.UserRole,
        description: 'Target user role/group (required when targetType is USER_GROUP)',
        example: interface_1.UserRole.CUSTOMER,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.targetType === NotificationTargetType.USER_GROUP),
    (0, class_validator_1.IsEnum)(interface_1.UserRole),
    __metadata("design:type", String)
], AdminSendNotificationDto.prototype, "userGroup", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification title', example: 'Flash Sale Alert! 🎉' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdminSendNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notification body message',
        example: 'Get up to 50% off on all electronics this weekend only!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdminSendNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: notification_interface_1.NotificationType,
        default: notification_interface_1.NotificationType.MARKETING,
        description: 'Notification type (MARKETING or SYSTEM)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_interface_1.NotificationType),
    __metadata("design:type", String)
], AdminSendNotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: notification_interface_1.NotificationCategory,
        default: notification_interface_1.NotificationCategory.MARKETING,
        description: 'Notification category',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notification_interface_1.NotificationCategory),
    __metadata("design:type", String)
], AdminSendNotificationDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Arbitrary key-value metadata payload for deep links/action buttons',
        example: { url: '/sale', promoCode: 'WEEKEND50' },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], AdminSendNotificationDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: notification_interface_1.NotificationChannel,
        isArray: true,
        default: [notification_interface_1.NotificationChannel.IN_APP],
        description: 'Target delivery channels',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(notification_interface_1.NotificationChannel, { each: true }),
    __metadata("design:type", Array)
], AdminSendNotificationDto.prototype, "channels", void 0);
//# sourceMappingURL=admin-send-notification.dto.js.map