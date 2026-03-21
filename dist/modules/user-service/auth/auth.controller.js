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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const login_dto_1 = require("./dto/login.dto");
const phone_auth_dto_1 = require("./dto/phone-auth.dto");
const register_dto_1 = require("./dto/register.dto");
const social_auth_dto_1 = require("./dto/social-auth.dto");
const auth_service_1 = require("./services/auth.service");
const phone_auth_service_1 = require("./services/phone-auth.service");
const social_auth_service_1 = require("./services/social-auth.service");
let AuthController = class AuthController {
    authService;
    phoneAuthService;
    socialAuthService;
    constructor(authService, phoneAuthService, socialAuthService) {
        this.authService = authService;
        this.phoneAuthService = phoneAuthService;
        this.socialAuthService = socialAuthService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto, res) {
        const result = await this.authService.login(loginDto);
        return result;
    }
    async getMe(user) {
        return await this.authService.getMe(user._id.toString());
    }
    async logout(req) {
        return this.authService.logout(req.user._id.toString());
    }
    async refresh(refreshTokenFromReq, req, res) {
        const refreshToken = (refreshTokenFromReq ||
            req.cookies?.refreshToken);
        const tokens = await this.authService.refreshTokens(refreshToken);
        return tokens;
    }
    async verifyEmail(token) {
        return this.authService.verifyEmail({ token });
    }
    async resendVerification(email) {
        return this.authService.resendVerification(email);
    }
    async phoneStart(phoneStartDto) {
        return this.phoneAuthService.phoneStart(phoneStartDto);
    }
    async phoneVerify(phoneVerifyDto, res) {
        const result = await this.phoneAuthService.phoneVerify(phoneVerifyDto);
        return result;
    }
    async phoneResend(phoneResendDto) {
        return this.phoneAuthService.resendPhoneOtp(phoneResendDto.phoneNumber);
    }
    async googleLogin(googleLoginDto, res) {
        const result = await this.socialAuthService.googleLogin(googleLoginDto);
        return result;
    }
    async facebookLogin(facebookLoginDto, res) {
        const result = await this.socialAuthService.facebookLogin(facebookLoginDto);
        return result;
    }
    setRefreshTokenCookie(res, refreshToken) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully registered' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict (Email/Phone already exists)',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Login user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profile retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiOperation)({ summary: 'Logout user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logout successful' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh tokens' }),
    __param(0, (0, common_1.Body)('refreshToken')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('verify-email'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify email with token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email verified successfully' }),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('resend-verification'),
    (0, swagger_1.ApiOperation)({ summary: 'Resend verification email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verification email resent' }),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerification", null);
__decorate([
    (0, common_1.Post)('phone/start'),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Start phone registration/OTP request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OTP sent' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phone_auth_dto_1.PhoneStartDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "phoneStart", null);
__decorate([
    (0, common_1.Post)('phone/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify phone OTP and login/register' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Phone verified and logged in' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phone_auth_dto_1.PhoneVerifyDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "phoneVerify", null);
__decorate([
    (0, common_1.Post)('phone/resend'),
    (0, swagger_1.ApiOperation)({ summary: 'Resend phone OTP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OTP resent' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phone_auth_dto_1.PhoneResendDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "phoneResend", null);
__decorate([
    (0, common_1.Post)('google'),
    (0, swagger_1.ApiOperation)({ summary: 'Google OAuth login' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [social_auth_dto_1.GoogleLoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Post)('facebook'),
    (0, swagger_1.ApiOperation)({ summary: 'Facebook OAuth login' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [social_auth_dto_1.FacebookLoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facebookLogin", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        phone_auth_service_1.PhoneAuthService,
        social_auth_service_1.SocialAuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map