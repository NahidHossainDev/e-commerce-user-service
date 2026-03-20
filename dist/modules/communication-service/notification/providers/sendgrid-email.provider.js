"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SendGridEmailProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendGridEmailProvider = void 0;
const common_1 = require("@nestjs/common");
let SendGridEmailProvider = SendGridEmailProvider_1 = class SendGridEmailProvider {
    logger = new common_1.Logger(SendGridEmailProvider_1.name);
    async send(options) {
        this.logger.log(`[SendGrid STUB] Sending email to ${options.to} with subject: ${options.subject}`);
        return Promise.resolve();
    }
};
exports.SendGridEmailProvider = SendGridEmailProvider;
exports.SendGridEmailProvider = SendGridEmailProvider = SendGridEmailProvider_1 = __decorate([
    (0, common_1.Injectable)()
], SendGridEmailProvider);
//# sourceMappingURL=sendgrid-email.provider.js.map