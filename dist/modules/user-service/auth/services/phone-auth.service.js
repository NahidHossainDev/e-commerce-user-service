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
var PhoneAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneAuthService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../user/user.schema");
const user_service_1 = require("../../user/user.service");
const auth_constants_1 = require("../constants/auth.constants");
const auth_events_1 = require("../events/auth.events");
const helper_1 = require("../helper/helper");
const otp_log_schema_1 = require("../schemas/otp-log.schema");
const otp_schema_1 = require("../schemas/otp.schema");
const auth_service_1 = require("./auth.service");
let PhoneAuthService = PhoneAuthService_1 = class PhoneAuthService {
    userService;
    eventEmitter;
    authService;
    otpModel;
    otpLogModel;
    logger = new common_1.Logger(PhoneAuthService_1.name);
    constructor(userService, eventEmitter, authService, otpModel, otpLogModel) {
        this.userService = userService;
        this.eventEmitter = eventEmitter;
        this.authService = authService;
        this.otpModel = otpModel;
        this.otpLogModel = otpLogModel;
    }
    async phoneStart(payload) {
        const { phoneNumber } = payload;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const count = await this.otpLogModel.countDocuments({
            phoneNumber,
            attemptedAt: { $gte: today },
        });
        if (count >= 5) {
            this.logger.warn(`Daily SMS limit reached for ${phoneNumber}`);
            throw new common_1.BadRequestException('Daily SMS limit reached. Try again tomorrow.');
        }
        const rawOtp = (0, helper_1.generateOtp)();
        const otpHash = (0, helper_1.generateHash)(rawOtp);
        await this.otpModel.findOneAndUpdate({ phoneNumber }, {
            phoneNumber,
            otpHash,
            expiresAt: new Date(Date.now() + auth_constants_1.AUTH_CONSTANTS.PHONE_OTP_EXPIRY_MINUTES * 60 * 1000),
            attempts: 0,
            verified: false,
        }, { upsert: true, new: true });
        this.eventEmitter.emit(auth_events_1.AUTH_EVENTS.PHONE_OTP_REQUESTED, new auth_events_1.PhoneOtpRequestedEvent(phoneNumber, rawOtp));
        await this.otpLogModel.create({
            phoneNumber,
            attemptedAt: new Date(),
            success: true,
        });
        return {
            message: 'OTP sent successfully',
        };
    }
    async phoneVerify(payload) {
        const { phoneNumber, otp } = payload;
        const otpHash = (0, helper_1.generateHash)(otp);
        const otpRecord = await this.otpModel.findOne({
            phoneNumber,
            expiresAt: { $gt: new Date() },
            verified: false,
        });
        if (!otpRecord) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        if (otpRecord.attempts >= 5) {
            throw new common_1.BadRequestException('Too many invalid attempts. Please request a new OTP.');
        }
        if (otpRecord.otpHash !== otpHash) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            throw new common_1.BadRequestException('Invalid OTP');
        }
        otpRecord.verified = true;
        await otpRecord.save();
        let user = await this.userService.findByPhoneNumber(phoneNumber);
        if (!user) {
            const newUser = {
                phoneNumber,
                password: (0, helper_1.generateRandomPassword)(),
                profile: { fullName: `User ${phoneNumber.slice(-4)}` },
                accountStatus: user_schema_1.AccountStatus.ACTIVE,
                provider: user_schema_1.AuthProvider.LOCAL,
                verification: {
                    phoneVerified: true,
                    phoneVerifiedAt: new Date(),
                    emailVerified: false,
                },
            };
            user = await this.userService.create(newUser);
        }
        else {
            const updatedUser = {
                accountStatus: user_schema_1.AccountStatus.ACTIVE,
                verification: {
                    ...user.verification,
                    phoneVerified: true,
                    phoneVerifiedAt: new Date(),
                },
            };
            await this.userService.update(user._id.toString(), updatedUser);
        }
        return this.authService.issueTokens(user);
    }
    async resendPhoneOtp(phoneNumber) {
        return this.phoneStart({ phoneNumber });
    }
};
exports.PhoneAuthService = PhoneAuthService;
exports.PhoneAuthService = PhoneAuthService = PhoneAuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, mongoose_1.InjectModel)(otp_schema_1.Otp.name)),
    __param(4, (0, mongoose_1.InjectModel)(otp_log_schema_1.OtpLog.name)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        event_emitter_1.EventEmitter2,
        auth_service_1.AuthService,
        mongoose_2.Model,
        mongoose_2.Model])
], PhoneAuthService);
//# sourceMappingURL=phone-auth.service.js.map