import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import {
  AccountStatus,
  AuthProvider,
} from 'src/modules/user-service/user/user.schema';
import { UserService } from 'src/modules/user-service/user/user.service';
import { AuthService } from '../auth.service';
import { PhoneStartDto, PhoneVerifyDto } from '../dto/phone-auth.dto';
import { AUTH_EVENTS, PhoneOtpRequestedEvent } from '../events/auth.events';
import { Otp, OtpDocument } from '../schemas/otp.schema';

@Injectable()
export class PhoneAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
    private readonly authService: AuthService,
    @InjectModel(Otp.name)
    private readonly otpModel: Model<OtpDocument>,
  ) {}

  async phoneStart(payload: PhoneStartDto) {
    const { phoneNumber } = payload;

    // Generate 6-digit numeric OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash('sha256').update(rawOtp).digest('hex');

    // Store hashed OTP
    await this.otpModel.findOneAndUpdate(
      { phoneNumber },
      {
        phoneNumber,
        otpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
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

    return {
      message: 'OTP sent successfully',
    };
  }

  async phoneVerify(payload: PhoneVerifyDto) {
    const { phoneNumber, otp } = payload;
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

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
        password: crypto.randomBytes(16).toString('hex'),
        profile: { fullName: `User ${phoneNumber.slice(-4)}` },
        accountStatus: AccountStatus.ACTIVE,
        provider: AuthProvider.LOCAL,
        verification: {
          phoneVerified: true,
          phoneVerifiedAt: new Date(),
          emailVerified: false,
        },
      };
      user = await this.userService.create(newUser as any);
    } else {
      const updatedUser = {
        accountStatus: AccountStatus.ACTIVE,
        verification: {
          ...user.verification,
          phoneVerified: true,
          phoneVerifiedAt: new Date(),
        },
      };
      await this.userService.update(user._id.toString(), updatedUser as any);
    }

    return this.authService.issueTokens(user);
  }

  async resendPhoneOtp(phoneNumber: string) {
    return this.phoneStart({ phoneNumber });
  }
}
