import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { config } from 'src/config';
import { UserService } from 'src/modules/user-service/user/user.service';
import { AUTH_CONSTANTS } from './constants/auth.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import * as crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { Model } from 'mongoose';
import { NotificationService } from 'src/modules/communication-service/notification/notification.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  AccountStatus,
  AuthProvider,
  UserDocument,
  UserRole,
} from '../user/user.schema';
import { PhoneStartDto, PhoneVerifyDto } from './dto/phone-auth.dto';
import { FacebookLoginDto, GoogleLoginDto } from './dto/social-auth.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import {
  AUTH_EVENTS,
  PhoneOtpRequestedEvent,
  UserRegisteredEvent,
  UserResendVerificationEvent,
} from './events/auth.events';
import { Otp, OtpDocument } from './schemas/otp.schema';
import {
  VerificationToken,
  VerificationTokenDocument,
  VerificationTokenType,
} from './schemas/verification-token.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
    private eventEmitter: EventEmitter2,
    @InjectModel(VerificationToken.name)
    private verificationTokenModel: Model<VerificationTokenDocument>,
    @InjectModel(Otp.name)
    private otpModel: Model<OtpDocument>,
  ) {}

  async register(payload: RegisterDto) {
    const { password, fullName } = payload;
    const email = payload.email.trim().toLowerCase();

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const userPayload: Partial<CreateUserDto> = {
      ...payload,
      email,
      password,
      profile: { fullName },
      accountStatus: AccountStatus.PENDING_VERIFICATION,
      primaryRole: UserRole.CUSTOMER,
    };

    const newUser = await this.userService.create(userPayload as CreateUserDto);

    // Generate Verification Token (32+ bytes)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    // Store hashed token
    await this.verificationTokenModel.create({
      userId: newUser._id,
      tokenHash,
      type: VerificationTokenType.EMAIL_VERIFICATION,
      expiresAt: new Date(
        Date.now() +
          AUTH_CONSTANTS.EMAIL_VERIFICATION_EXPIRY_MINUTES * 60 * 1000,
      ), // 30 minutes
    });

    // Emit Event
    this.eventEmitter.emit(
      AUTH_EVENTS.USER_REGISTERED,
      new UserRegisteredEvent(
        newUser._id.toString(),
        email,
        rawToken,
        fullName,
      ),
    );

    return {
      message:
        'We have sent an email to verify your email address. Please verify your email address to complete the registration process.',
    };
  }

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

    // Issue JWT
    const tokenPayload = {
      sub: user._id,
      email: user.email,
      role: user.primaryRole,
    };
    const accessToken = this.jwtService.sign(tokenPayload);
    const refreshToken = this.jwtService.sign(
      { ...tokenPayload, jti: Math.random().toString() },
      {
        expiresIn: '7d',
        secret: config.jwtSecretKey,
      },
    );

    const refreshTokenHash = await bcrypt.hash(
      refreshToken,
      Number(config.saltRound),
    );
    await this.userService.updateRefreshToken(
      user._id.toString(),
      refreshTokenHash,
    );

    return {
      accessToken,
      refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  async resendPhoneOtp(phoneNumber: string) {
    return this.phoneStart({ phoneNumber });
  }

  async googleLogin(payload: GoogleLoginDto) {
    const { googleIdToken } = payload;
    const googleUser = await this.verifyGoogleToken(googleIdToken);

    if (!googleUser) {
      throw new UnauthorizedException('Invalid Google Token');
    }

    const { email, name, sub: googleId } = googleUser;

    let user = await this.userService.findByEmail(email!);
    if (user) {
      // Link Google ID if not already linked
      if (!user.googleId) {
        const updatedUser = {
          googleId,
          provider: AuthProvider.GOOGLE,
          verification: { ...user.verification, emailVerified: true },
        };
        await this.userService.update(user._id.toString(), updatedUser as any);
      }
    } else {
      const newUser = {
        email,
        password: crypto.randomBytes(16).toString('hex'),
        profile: { fullName: name },
        googleId,
        provider: AuthProvider.GOOGLE,
        accountStatus: AccountStatus.ACTIVE,
        verification: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
          phoneVerified: false,
        },
      };
      user = await this.userService.create(newUser as any);
    }

    return this.issueTokens(user);
  }

  async facebookLogin(payload: FacebookLoginDto) {
    const { facebookAccessToken } = payload;
    const fbUser = await this.verifyFacebookToken(facebookAccessToken);

    if (!fbUser) {
      throw new UnauthorizedException('Invalid Facebook Token');
    }

    const { email, name, id: facebookId } = fbUser;

    // Handle missing email by forcing phone verification (simplified here to error)
    if (!email) {
      throw new BadRequestException(
        'Email not provided by Facebook. Please use phone login.',
      );
    }

    let user = await this.userService.findByEmail(email);
    if (user) {
      if (!user.facebookId) {
        const updatedUser = {
          facebookId,
          provider: AuthProvider.FACEBOOK,
          verification: { ...user.verification, emailVerified: true },
        };
        await this.userService.update(user._id.toString(), updatedUser);
      }
    } else {
      const newUser = {
        email,
        password: crypto.randomBytes(16).toString('hex'),
        profile: { fullName: name },
        facebookId,
        provider: AuthProvider.FACEBOOK,
        accountStatus: AccountStatus.ACTIVE,
        verification: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
          phoneVerified: false,
        },
      };
      user = await this.userService.create(newUser);
    }

    return this.issueTokens(user);
  }

  private async verifyGoogleToken(token: string) {
    const client = new OAuth2Client(config.social.google.clientId);
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.social.google.clientId,
      });
      return ticket.getPayload();
    } catch (error) {
      return null;
    }
  }

  private async verifyFacebookToken(token: string) {
    try {
      const { data } = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`,
      );
      return data;
    } catch (error) {
      return null;
    }
  }

  private async issueTokens(user: UserDocument) {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.primaryRole,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { ...payload, jti: Math.random().toString() },
      {
        expiresIn: '7d',
        secret: config.jwtSecretKey,
      },
    );

    const refreshTokenHash = await bcrypt.hash(
      refreshToken,
      Number(config.saltRound),
    );
    await this.userService.updateRefreshToken(
      user._id.toString(),
      refreshTokenHash,
    );

    return {
      accessToken,
      refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  async verifyEmail(payload: VerifyEmailDto) {
    const { token } = payload;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const tokenRecord = await this.verificationTokenModel.findOne({
      tokenHash,
      type: VerificationTokenType.EMAIL_VERIFICATION,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenRecord) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    tokenRecord.used = true;
    await tokenRecord.save();

    const updatedUser = {
      accountStatus: AccountStatus.ACTIVE,
      verification: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        phoneVerified: false,
      },
    };
    await this.userService.update(tokenRecord.userId.toString(), updatedUser);
    return { message: 'Email verified successfully' };
  }

  async resendVerification(email: string) {
    const user = await this.userService.findByEmail(email.trim().toLowerCase());
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.verification.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Throttling: Check if there's a recent token (within 2 minutes)
    const recentToken = await this.verificationTokenModel.findOne({
      userId: user._id,
      type: VerificationTokenType.EMAIL_VERIFICATION,
      createdAt: {
        $gt: new Date(
          Date.now() - AUTH_CONSTANTS.VERIFICATION_THROTTLE_MINUTES * 60 * 1000,
        ),
      },
    });

    if (recentToken) {
      throw new BadRequestException(
        'Please wait a moment before requesting another link',
      );
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    await this.verificationTokenModel.create({
      userId: user._id,
      tokenHash,
      type: VerificationTokenType.EMAIL_VERIFICATION,
      expiresAt: new Date(
        Date.now() +
          AUTH_CONSTANTS.EMAIL_VERIFICATION_EXPIRY_MINUTES * 60 * 1000,
      ),
    });

    this.eventEmitter.emit(
      AUTH_EVENTS.USER_RESEND_VERIFICATION,
      new UserResendVerificationEvent(
        user._id.toString(),
        user.email!,
        rawToken,
        user.profile.fullName,
      ),
    );

    return { message: 'Verification email resent' };
  }

  async login(loginDto: LoginDto) {
    const { phoneNumber, password } = loginDto;

    const email = loginDto.email?.trim().toLowerCase();

    if (!email && !phoneNumber) {
      throw new BadRequestException('Email or Phone Number is required');
    }

    let user: UserDocument | null = null;
    if (email) {
      user = await this.userService.findByEmail(email);
    } else if (phoneNumber) {
      user = await this.userService.findByPhoneNumber(phoneNumber);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Brute Force Protection
    if (user.security.lockUntil && user.security.lockUntil > new Date()) {
      throw new UnauthorizedException(
        `Account is locked until ${user.security.lockUntil.toISOString()}`,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Increment failed attempts
      const attempts = (user.security.failedLoginAttempts || 0) + 1;
      const updates: any = { failedLoginAttempts: attempts };

      if (attempts >= AUTH_CONSTANTS.MAX_FAILED_LOGIN_ATTEMPTS) {
        updates.lockUntil = new Date(
          Date.now() + AUTH_CONSTANTS.ACCOUNT_LOCKOUT_MINUTES * 60 * 1000,
        ); // 15 minutes
        updates.failedLoginAttempts = 0;
      }
      await this.userService.updateSecurity(user._id.toString(), updates);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed attempts on success
    if (user.security.failedLoginAttempts > 0 || user.security.lockUntil) {
      await this.userService.updateSecurity(user._id.toString(), {
        failedLoginAttempts: 0,
        lockUntil: undefined,
      });
    }

    if (
      user.accountStatus === AccountStatus.SUSPENDED ||
      user.accountStatus === AccountStatus.BLOCKED ||
      user.accountStatus === AccountStatus.DELETED ||
      user.accountStatus === AccountStatus.PENDING_VERIFICATION
    ) {
      const message =
        user.accountStatus === AccountStatus.PENDING_VERIFICATION
          ? 'Please verify your email to login'
          : `Account is ${user.accountStatus}`;
      throw new UnauthorizedException(message);
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.primaryRole,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { ...payload, jti: Math.random().toString() },
      {
        expiresIn: '7d',
        secret: config.jwtSecretKey,
      },
    );

    const refreshTokenHash = await bcrypt.hash(
      refreshToken,
      Number(config.saltRound),
    );
    await this.userService.updateRefreshToken(
      user._id.toString(),
      refreshTokenHash,
    );

    return {
      accessToken,
      refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  async logout(userId: string) {
    return this.userService.updateRefreshToken(userId, null);
  }

  async refreshTokens(refreshToken: string) {
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: config.jwtSecretKey,
      });
    } catch {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const user = await this.userService.findOne(payload.sub);
    if (!user || !user.security.refreshTokenHash) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.security.refreshTokenHash,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    // Rotate tokens
    const newPayload = {
      sub: user._id,
      email: user.email,
      role: user.primaryRole,
    };
    const accessToken = this.jwtService.sign(newPayload);
    const newRefreshToken = this.jwtService.sign(
      { ...newPayload, jti: Math.random().toString() },
      {
        expiresIn: '7d',
        secret: config.jwtSecretKey,
      },
    );

    const newRefreshTokenHash = await bcrypt.hash(
      newRefreshToken,
      Number(config.saltRound),
    );
    await this.userService.updateRefreshToken(
      user._id.toString(),
      newRefreshTokenHash,
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  private sanitizeUser(user: UserDocument) {
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
}
