import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { config } from 'src/config';
import { UserService } from 'src/modules/user-service/user/user.service';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { AccountStatus, UserDocument, UserRole } from '../../user/user.schema';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import {
  AUTH_EVENTS,
  UserRegisteredEvent,
  UserResendVerificationEvent,
} from '../events/auth.events';
import { generateHash } from '../helper/helper';
import {
  VerificationToken,
  VerificationTokenDocument,
  VerificationTokenType,
} from '../schemas/verification-token.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    @InjectModel(VerificationToken.name)
    private verificationTokenModel: Model<VerificationTokenDocument>,
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

    const rawToken = await this.createVerificationToken(
      newUser._id,
      VerificationTokenType.EMAIL_VERIFICATION,
    );

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
      message: 'We sent you a verification email. Please verify to continue.',
    };
  }

  async verifyEmail(payload: VerifyEmailDto) {
    const { token } = payload;
    const tokenHash = generateHash(token);

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

    const rawToken = await this.createVerificationToken(
      user._id,
      VerificationTokenType.EMAIL_VERIFICATION,
    );

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
      this.logger.warn(`Login attempt on locked account: ${user.email}`);
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
      this.logger.warn(`Failed login attempt for user: ${user.email}`);
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

    return this.issueTokens(user);
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

  async issueTokens(user: UserDocument) {
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

  sanitizeUser(user: UserDocument) {
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

  private async createVerificationToken(
    userId: any,
    type: VerificationTokenType,
  ) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = generateHash(rawToken);

    await this.verificationTokenModel.create({
      userId,
      tokenHash,
      type,
      expiresAt: new Date(
        Date.now() +
          AUTH_CONSTANTS.EMAIL_VERIFICATION_EXPIRY_MINUTES * 60 * 1000,
      ),
    });

    return rawToken;
  }
}
