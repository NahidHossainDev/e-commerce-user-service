import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { config } from 'src/config';
import { AccountStatus, UserRole } from 'src/modules/user-service/user/user.schema';
import { UserService } from 'src/modules/user-service/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import { NotificationService } from 'src/modules/communication-service/notification/notification.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { phoneNumber, password, fullName } = registerDto;

    const email = registerDto.email?.trim().toLowerCase();

    if (!email && !phoneNumber) {
      throw new BadRequestException('Email or Phone Number is required');
    }

    if (email) {
      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    if (phoneNumber) {
      const existingUser =
        await this.userService.findByPhoneNumber(phoneNumber);
      if (existingUser) {
        throw new ConflictException('Phone number already exists');
      }
    }

    // Generate Verification Token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString(); // 6 digit OTP

    const newUser = await this.userService.create({
      ...registerDto,
      email,
      profile: { fullName },
      accountStatus: AccountStatus.PENDING,
      primaryRole: UserRole.CUSTOMER,
      password,
      verification: {
        emailVerificationToken: email ? verificationToken : undefined,
        phoneVerificationToken: phoneNumber ? verificationToken : undefined,
      },
    } as any);

    if (email) {
      await this.notificationService.sendEmailVerification(
        email,
        verificationToken,
      );
    }
    if (phoneNumber) {
      await this.notificationService.sendPhoneVerification(
        phoneNumber,
        verificationToken,
      );
    }

    // Fix #1: Sensitive Data Exposure - Return sanitized object
    // Using simple object mapping here for simplicity, or could use class-transformer
    return this.sanitizeUser(newUser);
  }

  async login(loginDto: LoginDto) {
    const { phoneNumber, password } = loginDto;
    // Fix #5: Input Normalization
    const email = loginDto.email?.trim().toLowerCase();

    if (!email && !phoneNumber) {
      throw new BadRequestException('Email or Phone Number is required');
    }

    let user;
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
        `Account is locked until ${user.security.lockUntil}`,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Increment failed attempts
      const attempts = (user.security.failedLoginAttempts || 0) + 1;
      const updates: any = { failedLoginAttempts: attempts };

      if (attempts >= 5) {
        updates.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        updates.failedLoginAttempts = 0; // Reset or keep? Usually reset after timeout, but effectively lock resets logic.
        // Better pattern: keep counting or reset on successful login.
        // Here simply setting lock.
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
      user.accountStatus === AccountStatus.DELETED
    ) {
      throw new UnauthorizedException(`Account is ${user.accountStatus}`);
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
        expiresIn: '7d', // Configurable
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

    // Fix #1: Sensitive Data Exposure
    return {
      accessToken,
      refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  async logout(userId: string) {
    return this.userService.updateRefreshToken(userId, null);
  }

  // Fix #2: Broken Refresh Token Flow
  async refreshTokens(refreshToken: string) {
    let payload;
    try {
      // Manual verification
      payload = this.jwtService.verify(refreshToken, {
        secret: config.jwtSecretKey,
      });
    } catch (e) {
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
        expiresIn: '7d', // Configurable
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

  private sanitizeUser(user: any) {
    const u = user.toObject ? user.toObject() : user;
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
