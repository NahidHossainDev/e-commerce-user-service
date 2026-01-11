import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AccountStatus,
  AuthProvider,
} from 'src/modules/user-service/user/user.schema';
import { UserService } from 'src/modules/user-service/user/user.service';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { PhoneStartDto, PhoneVerifyDto } from '../dto/phone-auth.dto';
import { AUTH_EVENTS, PhoneOtpRequestedEvent } from '../events/auth.events';
import {
  generateHash,
  generateOtp,
  generateRandomPassword,
} from '../helper/helper';
import { OtpLog, OtpLogDocument } from '../schemas/otp-log.schema';
import { Otp, OtpDocument } from '../schemas/otp.schema';
import { AuthService } from './auth.service';

@Injectable()
export class PhoneAuthService {
  private readonly logger = new Logger(PhoneAuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
    private readonly authService: AuthService,
    @InjectModel(Otp.name)
    private readonly otpModel: Model<OtpDocument>,
    @InjectModel(OtpLog.name)
    private readonly otpLogModel: Model<OtpLogDocument>,
  ) {}

  async phoneStart(payload: PhoneStartDto) {
    const { phoneNumber } = payload;

    // Daily Limit Check
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await this.otpLogModel.countDocuments({
      phoneNumber,
      attemptedAt: { $gte: today },
    });

    if (count >= 5) {
      this.logger.warn(`Daily SMS limit reached for ${phoneNumber}`);
      throw new BadRequestException(
        'Daily SMS limit reached. Try again tomorrow.',
      );
    }

    // Generate 6-digit numeric OTP
    const rawOtp = generateOtp();
    const otpHash = generateHash(rawOtp);

    // Store hashed OTP
    await this.otpModel.findOneAndUpdate(
      { phoneNumber },
      {
        phoneNumber,
        otpHash,
        expiresAt: new Date(
          Date.now() + AUTH_CONSTANTS.PHONE_OTP_EXPIRY_MINUTES * 60 * 1000,
        ),
        attempts: 0,
        verified: false,
      },
      { upsert: true, new: true },
    );

    // Emit Event
    this.eventEmitter.emit(
      AUTH_EVENTS.PHONE_OTP_REQUESTED,
      new PhoneOtpRequestedEvent(phoneNumber, rawOtp),
    );

    // Log Attempt
    await this.otpLogModel.create({
      phoneNumber,
      attemptedAt: new Date(),
      success: true,
    });

    return {
      message: 'OTP sent successfully',
    };
  }

  async phoneVerify(payload: PhoneVerifyDto) {
    const { phoneNumber, otp } = payload;
    const otpHash = generateHash(otp);

    const otpRecord = await this.otpModel.findOne({
      phoneNumber,
      expiresAt: { $gt: new Date() },
      verified: false,
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (otpRecord.attempts >= 5) {
      throw new BadRequestException(
        'Too many invalid attempts. Please request a new OTP.',
      );
    }

    if (otpRecord.otpHash !== otpHash) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new BadRequestException('Invalid OTP');
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Find or Create User
    let user = await this.userService.findByPhoneNumber(phoneNumber);
    if (!user) {
      const newUser = {
        phoneNumber,
        password: generateRandomPassword(),
        profile: { fullName: `User ${phoneNumber.slice(-4)}` },
        accountStatus: AccountStatus.ACTIVE,
        provider: AuthProvider.LOCAL,
        verification: {
          phoneVerified: true,
          phoneVerifiedAt: new Date(),
          emailVerified: false,
        },
      };
      user = await this.userService.create(newUser);
    } else {
      const updatedUser = {
        accountStatus: AccountStatus.ACTIVE,
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

  async resendPhoneOtp(phoneNumber: string) {
    return this.phoneStart({ phoneNumber });
  }
}
