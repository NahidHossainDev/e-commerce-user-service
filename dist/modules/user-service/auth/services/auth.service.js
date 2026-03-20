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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const config_1 = require("../../../../config");
const user_service_1 = require("../../user/user.service");
const auth_constants_1 = require("../constants/auth.constants");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("@nestjs/mongoose");
const crypto = require("crypto");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../user/user.schema");
const auth_events_1 = require("../events/auth.events");
const helper_1 = require("../helper/helper");
const verification_token_schema_1 = require("../schemas/verification-token.schema");
let AuthService = AuthService_1 = class AuthService {
    userService;
    jwtService;
    eventEmitter;
    verificationTokenModel;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(userService, jwtService, eventEmitter, verificationTokenModel) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.eventEmitter = eventEmitter;
        this.verificationTokenModel = verificationTokenModel;
    }
    async register(payload) {
        const { password, fullName } = payload;
        const email = payload.email.trim().toLowerCase();
        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const userPayload = {
            ...payload,
            email,
            password,
            profile: { fullName },
            accountStatus: user_schema_1.AccountStatus.PENDING_VERIFICATION,
            primaryRole: user_schema_1.UserRole.CUSTOMER,
        };
        const newUser = await this.userService.create(userPayload);
        const rawToken = await this.createVerificationToken(newUser._id, verification_token_schema_1.VerificationTokenType.EMAIL_VERIFICATION);
        this.eventEmitter.emit(auth_events_1.AUTH_EVENTS.USER_REGISTERED, new auth_events_1.UserRegisteredEvent(newUser._id.toString(), email, rawToken, fullName));
        return {
            message: 'We sent you a verification email. Please verify to continue.',
        };
    }
    async verifyEmail(payload) {
        const { token } = payload;
        const tokenHash = (0, helper_1.generateHash)(token);
        const tokenRecord = await this.verificationTokenModel.findOne({
            tokenHash,
            type: verification_token_schema_1.VerificationTokenType.EMAIL_VERIFICATION,
            used: false,
            expiresAt: { $gt: new Date() },
        });
        if (!tokenRecord) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
        tokenRecord.used = true;
        await tokenRecord.save();
        const updatedUser = {
            accountStatus: user_schema_1.AccountStatus.ACTIVE,
            verification: {
                emailVerified: true,
                emailVerifiedAt: new Date(),
                phoneVerified: false,
            },
        };
        await this.userService.update(tokenRecord.userId.toString(), updatedUser);
        return { message: 'Email verified successfully' };
    }
    async resendVerification(email) {
        const user = await this.userService.findByEmail(email.trim().toLowerCase());
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.verification.emailVerified) {
            throw new common_1.BadRequestException('Email is already verified');
        }
        const recentToken = await this.verificationTokenModel.findOne({
            userId: user._id,
            type: verification_token_schema_1.VerificationTokenType.EMAIL_VERIFICATION,
            createdAt: {
                $gt: new Date(Date.now() - auth_constants_1.AUTH_CONSTANTS.VERIFICATION_THROTTLE_MINUTES * 60 * 1000),
            },
        });
        if (recentToken) {
            throw new common_1.BadRequestException('Please wait a moment before requesting another link');
        }
        const rawToken = await this.createVerificationToken(user._id, verification_token_schema_1.VerificationTokenType.EMAIL_VERIFICATION);
        this.eventEmitter.emit(auth_events_1.AUTH_EVENTS.USER_RESEND_VERIFICATION, new auth_events_1.UserResendVerificationEvent(user._id.toString(), user.email, rawToken, user.profile.fullName));
        return { message: 'Verification email resent' };
    }
    async login(loginDto) {
        const { phoneNumber, password } = loginDto;
        const email = loginDto.email?.trim().toLowerCase();
        if (!email && !phoneNumber) {
            throw new common_1.BadRequestException('Email or Phone Number is required');
        }
        let user = null;
        if (email) {
            user = await this.userService.findByEmail(email, true);
        }
        else if (phoneNumber) {
            user = await this.userService.findByPhoneNumber(phoneNumber, true);
        }
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.security.lockUntil && user.security.lockUntil > new Date()) {
            this.logger.warn(`Login attempt on locked account: ${user.email}`);
            throw new common_1.UnauthorizedException(`Account is locked until ${user.security.lockUntil.toISOString()}`);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const attempts = (user.security.failedLoginAttempts || 0) + 1;
            const updates = { failedLoginAttempts: attempts };
            if (attempts >= auth_constants_1.AUTH_CONSTANTS.MAX_FAILED_LOGIN_ATTEMPTS) {
                updates.lockUntil = new Date(Date.now() + auth_constants_1.AUTH_CONSTANTS.ACCOUNT_LOCKOUT_MINUTES * 60 * 1000);
                updates.failedLoginAttempts = 0;
            }
            await this.userService.updateSecurity(user._id.toString(), updates);
            this.logger.warn(`Failed login attempt for user: ${user.email}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.security.failedLoginAttempts > 0 || user.security.lockUntil) {
            await this.userService.updateSecurity(user._id.toString(), {
                failedLoginAttempts: 0,
                lockUntil: undefined,
            });
        }
        if (user.accountStatus === user_schema_1.AccountStatus.SUSPENDED ||
            user.accountStatus === user_schema_1.AccountStatus.BLOCKED ||
            user.accountStatus === user_schema_1.AccountStatus.DELETED ||
            user.accountStatus === user_schema_1.AccountStatus.PENDING_VERIFICATION) {
            const message = user.accountStatus === user_schema_1.AccountStatus.PENDING_VERIFICATION
                ? 'Please verify your email to login'
                : `Account is ${user.accountStatus}`;
            throw new common_1.UnauthorizedException(message);
        }
        return this.issueTokens(user);
    }
    async logout(userId) {
        return this.userService.updateRefreshToken(userId, null);
    }
    async refreshTokens(refreshToken) {
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: config_1.config.jwtSecretKey,
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid Refresh Token');
        }
        const user = await this.userService.findOne(payload.sub, true);
        if (!user || !user.security.refreshTokenHash) {
            throw new common_1.UnauthorizedException('Access Denied');
        }
        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.security.refreshTokenHash);
        if (!refreshTokenMatches) {
            throw new common_1.UnauthorizedException('Access Denied');
        }
        const newPayload = {
            sub: user._id,
            email: user.email,
            role: user.primaryRole,
        };
        const accessToken = this.jwtService.sign(newPayload);
        const newRefreshToken = this.jwtService.sign({ ...newPayload, jti: Math.random().toString() }, {
            expiresIn: '7d',
            secret: config_1.config.jwtSecretKey,
        });
        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, Number(config_1.config.saltRound));
        await this.userService.updateRefreshToken(user._id.toString(), newRefreshTokenHash);
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }
    async issueTokens(user) {
        const payload = {
            sub: user._id,
            email: user.email,
            role: user.primaryRole,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign({ ...payload, jti: Math.random().toString() }, {
            expiresIn: '7d',
            secret: config_1.config.jwtSecretKey,
        });
        const refreshTokenHash = await bcrypt.hash(refreshToken, Number(config_1.config.saltRound));
        await this.userService.updateRefreshToken(user._id.toString(), refreshTokenHash);
        return {
            accessToken,
            refreshToken,
            user: this.sanitizeUser(user),
        };
    }
    sanitizeUser(user) {
        const u = user.toObject();
        return {
            _id: u._id,
            email: u.email,
            phoneNumber: u.phoneNumber,
            profile: u.profile,
            roles: u.roles,
            primaryRole: u.primaryRole,
            accountStatus: u.accountStatus,
        };
    }
    async getMe(userId) {
        const user = await this.userService.findOne(userId);
        return this.sanitizeUser(user);
    }
    async createVerificationToken(userId, type) {
        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = (0, helper_1.generateHash)(rawToken);
        await this.verificationTokenModel.create({
            userId,
            tokenHash,
            type,
            expiresAt: new Date(Date.now() +
                auth_constants_1.AUTH_CONSTANTS.EMAIL_VERIFICATION_EXPIRY_MINUTES * 60 * 1000),
        });
        return rawToken;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, mongoose_1.InjectModel)(verification_token_schema_1.VerificationToken.name)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        event_emitter_1.EventEmitter2,
        mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map