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
var NodemailerEmailProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodemailerEmailProvider = void 0;
const common_1 = require("@nestjs/common");
const nodemailer_1 = require("nodemailer");
let NodemailerEmailProvider = NodemailerEmailProvider_1 = class NodemailerEmailProvider {
    config;
    logger = new common_1.Logger(NodemailerEmailProvider_1.name);
    transporter;
    constructor(config) {
        this.config = config;
        const transporterOptions = {
            host: config.mail.host,
            port: config.mail.port,
            secure: config.mail.port === 465,
            auth: {
                user: config.mail.user,
                pass: config.mail.pass,
            },
        };
        this.transporter = (0, nodemailer_1.createTransport)(transporterOptions);
    }
    async send(options) {
        try {
            await this.transporter.sendMail({
                from: options.from || this.config.mail.from,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            });
            this.logger.log(`Email sent successfully to ${options.to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${options.to}`, error);
            throw error;
        }
    }
};
exports.NodemailerEmailProvider = NodemailerEmailProvider;
exports.NodemailerEmailProvider = NodemailerEmailProvider = NodemailerEmailProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], NodemailerEmailProvider);
//# sourceMappingURL=nodemailer-email.provider.js.map