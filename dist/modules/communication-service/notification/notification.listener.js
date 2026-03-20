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
var NotificationListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const auth_events_1 = require("../../user-service/auth/events/auth.events");
const notification_service_1 = require("./notification.service");
let NotificationListener = NotificationListener_1 = class NotificationListener {
    notificationService;
    logger = new common_1.Logger(NotificationListener_1.name);
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async handleUserRegisteredEvent(event) {
        this.logger.log(`Handling user registered event for: ${event.email}`);
        try {
            await this.notificationService.sendEmailVerification(event.email, event.rawVerificationToken, event.fullName);
        }
        catch (error) {
            this.logger.error(`Failed to send verification email to ${event.email}`, error);
        }
    }
    async handleUserResendVerificationEvent(event) {
        this.logger.log(`Handling user resend verification event for: ${event.email}`);
        try {
            await this.notificationService.sendEmailVerification(event.email, event.rawVerificationToken, event.fullName);
        }
        catch (error) {
            this.logger.error(`Failed to resend verification email to ${event.email}`, error);
        }
    }
};
exports.NotificationListener = NotificationListener;
__decorate([
    (0, event_emitter_1.OnEvent)(auth_events_1.AUTH_EVENTS.USER_REGISTERED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_events_1.UserRegisteredEvent]),
    __metadata("design:returntype", Promise)
], NotificationListener.prototype, "handleUserRegisteredEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)(auth_events_1.AUTH_EVENTS.USER_RESEND_VERIFICATION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_events_1.UserResendVerificationEvent]),
    __metadata("design:returntype", Promise)
], NotificationListener.prototype, "handleUserResendVerificationEvent", null);
exports.NotificationListener = NotificationListener = NotificationListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationListener);
//# sourceMappingURL=notification.listener.js.map