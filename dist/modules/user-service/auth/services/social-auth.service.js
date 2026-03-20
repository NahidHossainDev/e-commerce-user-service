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
var SocialAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAuthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const google_auth_library_1 = require("google-auth-library");
const config_1 = require("../../../../config");
const user_schema_1 = require("../../user/user.schema");
const user_service_1 = require("../../user/user.service");
const helper_1 = require("../helper/helper");
const auth_service_1 = require("./auth.service");
let SocialAuthService = SocialAuthService_1 = class SocialAuthService {
    userService;
    authService;
    logger = new common_1.Logger(SocialAuthService_1.name);
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async googleLogin(payload) {
        const { googleIdToken } = payload;
        const googleUser = await this.verifyGoogleToken(googleIdToken);
        if (!googleUser) {
            this.logger.warn('Invalid Google Token attempt');
            throw new common_1.UnauthorizedException('Invalid Google Token');
        }
        const { email, name, sub: googleId } = googleUser;
        let user = await this.userService.findByEmail(email);
        if (user) {
            if (!user.googleId) {
                const updatedUser = {
                    googleId,
                    provider: user_schema_1.AuthProvider.GOOGLE,
                    verification: { ...user.verification, emailVerified: true },
                };
                await this.userService.update(user._id.toString(), updatedUser);
            }
        }
        else {
            const newUser = {
                email,
                password: (0, helper_1.generateRandomPassword)(),
                profile: { fullName: name },
                googleId,
                provider: user_schema_1.AuthProvider.GOOGLE,
                accountStatus: user_schema_1.AccountStatus.ACTIVE,
                verification: {
                    emailVerified: true,
                    emailVerifiedAt: new Date(),
                    phoneVerified: false,
                },
            };
            user = await this.userService.create(newUser);
        }
        return this.authService.issueTokens(user);
    }
    async facebookLogin(payload) {
        const { facebookAccessToken } = payload;
        const fbUser = await this.verifyFacebookToken(facebookAccessToken);
        if (!fbUser) {
            this.logger.warn('Invalid Facebook Token attempt');
            throw new common_1.UnauthorizedException('Invalid Facebook Token');
        }
        const { email, name, id: facebookId } = fbUser;
        if (!email) {
            throw new common_1.BadRequestException('Email not provided by Facebook. Please use phone login.');
        }
        let user = await this.userService.findByEmail(email);
        if (user) {
            if (!user.facebookId) {
                const updatedUser = {
                    facebookId,
                    provider: user_schema_1.AuthProvider.FACEBOOK,
                    verification: { ...user.verification, emailVerified: true },
                };
                await this.userService.update(user._id.toString(), updatedUser);
            }
        }
        else {
            const newUser = {
                email,
                password: (0, helper_1.generateRandomPassword)(),
                profile: { fullName: name },
                facebookId,
                provider: user_schema_1.AuthProvider.FACEBOOK,
                accountStatus: user_schema_1.AccountStatus.ACTIVE,
                verification: {
                    emailVerified: true,
                    emailVerifiedAt: new Date(),
                    phoneVerified: false,
                },
            };
            user = await this.userService.create(newUser);
        }
        return this.authService.issueTokens(user);
    }
    async verifyGoogleToken(token) {
        const client = new google_auth_library_1.OAuth2Client(config_1.config.social.google.clientId);
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: config_1.config.social.google.clientId,
            });
            return ticket.getPayload();
        }
        catch (error) {
            return null;
        }
    }
    async verifyFacebookToken(token) {
        try {
            const { data } = await axios_1.default.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
            return data;
        }
        catch (error) {
            return null;
        }
    }
};
exports.SocialAuthService = SocialAuthService;
exports.SocialAuthService = SocialAuthService = SocialAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], SocialAuthService);
//# sourceMappingURL=social-auth.service.js.map