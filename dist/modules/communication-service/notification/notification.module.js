"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../../../config");
const email_provider_interface_1 = require("./interfaces/email-provider.interface");
const notification_listener_1 = require("./notification.listener");
const notification_service_1 = require("./notification.service");
const nodemailer_email_provider_1 = require("./providers/nodemailer-email.provider");
const sendgrid_email_provider_1 = require("./providers/sendgrid-email.provider");
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        providers: [
            notification_service_1.NotificationService,
            notification_listener_1.NotificationListener,
            {
                provide: email_provider_interface_1.EMAIL_PROVIDER,
                useFactory: () => {
                    if (config_1.config.mail.provider === 'sendgrid') {
                        return new sendgrid_email_provider_1.SendGridEmailProvider();
                    }
                    return new nodemailer_email_provider_1.NodemailerEmailProvider(config_1.config);
                },
            },
        ],
        exports: [notification_service_1.NotificationService],
    })
], NotificationModule);
//# sourceMappingURL=notification.module.js.map