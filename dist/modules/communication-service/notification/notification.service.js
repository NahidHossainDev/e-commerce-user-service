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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const email_provider_interface_1 = require("./interfaces/email-provider.interface");
const verify_email_template_1 = require("./templates/verify-email.template");
let NotificationService = NotificationService_1 = class NotificationService {
    emailProvider;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(emailProvider) {
        this.emailProvider = emailProvider;
    }
    async sendEmailVerification(email, token, name) {
        try {
            const template = (0, verify_email_template_1.verifyEmailTemplate)({
                name,
                token,
                url: `https://example.com/verify?token=${token}`,
            });
            await this.emailProvider.send({
                to: email,
                subject: template.subject,
                html: template.html,
                text: template.text,
            });
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send email verification to ${email}`, error);
            throw error;
        }
    }
    sendPhoneVerification(phoneNumber, token) {
        this.logger.log(`[SMS] To: ${phoneNumber} | Message: Your verification code is ${token}`);
        return true;
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(email_provider_interface_1.EMAIL_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], NotificationService);
//# sourceMappingURL=notification.service.js.map