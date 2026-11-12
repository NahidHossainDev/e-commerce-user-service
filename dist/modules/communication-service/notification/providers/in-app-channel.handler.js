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
var InAppChannelHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InAppChannelHandler = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_interface_1 = require("../interfaces/notification.interface");
const notification_schema_1 = require("../schemas/notification.schema");
let InAppChannelHandler = InAppChannelHandler_1 = class InAppChannelHandler {
    notificationModel;
    channel = notification_interface_1.NotificationChannel.IN_APP;
    logger = new common_1.Logger(InAppChannelHandler_1.name);
    constructor(notificationModel) {
        this.notificationModel = notificationModel;
    }
    async send(payload) {
        try {
            await this.notificationModel.create({
                recipient: new mongoose_2.Types.ObjectId(payload.recipientId),
                type: payload.type,
                category: payload.category,
                title: payload.title,
                message: payload.message,
                data: payload.data || {},
                channels: payload.channels || [notification_interface_1.NotificationChannel.IN_APP],
                metadata: payload.metadata || {},
            });
        }
        catch (error) {
            this.logger.error(`Failed to store in-app notification for recipient ${payload.recipientId}:`, error);
            throw error;
        }
    }
};
exports.InAppChannelHandler = InAppChannelHandler;
exports.InAppChannelHandler = InAppChannelHandler = InAppChannelHandler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InAppChannelHandler);
//# sourceMappingURL=in-app-channel.handler.js.map