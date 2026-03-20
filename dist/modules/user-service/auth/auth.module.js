"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("../../../config");
const user_module_1 = require("../user/user.module");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./services/auth.service");
const phone_auth_service_1 = require("./services/phone-auth.service");
const social_auth_service_1 = require("./services/social-auth.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const mongoose_1 = require("@nestjs/mongoose");
const notification_module_1 = require("../../communication-service/notification/notification.module");
const otp_log_schema_1 = require("./schemas/otp-log.schema");
const otp_schema_1 = require("./schemas/otp.schema");
const verification_token_schema_1 = require("./schemas/verification-token.schema");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            passport_1.PassportModule,
            notification_module_1.NotificationModule,
            mongoose_1.MongooseModule.forFeature([
                { name: verification_token_schema_1.VerificationToken.name, schema: verification_token_schema_1.VerificationTokenSchema },
                { name: otp_schema_1.Otp.name, schema: otp_schema_1.OtpSchema },
                { name: otp_log_schema_1.OtpLog.name, schema: otp_log_schema_1.OtpLogSchema },
            ]),
            jwt_1.JwtModule.register({
                secret: config_1.config.jwtSecretKey,
                signOptions: { expiresIn: config_1.config.jwtExpire },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, phone_auth_service_1.PhoneAuthService, social_auth_service_1.SocialAuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService, phone_auth_service_1.PhoneAuthService, social_auth_service_1.SocialAuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map