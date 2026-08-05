import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiWrappedResponse } from '../../../utils/response/swagger.helper';
import { UserDocument } from '../user/user.schema';
import {
  AuthResponseDto,
  AuthTokensResponseDto,
  LogoutResponseDto,
  MessageResponseDto,
  SanitizedUserDto,
} from './dto/auth-response.dto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyResetTokenDto,
} from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import {
  PhoneResendDto,
  PhoneStartDto,
  PhoneVerifyDto,
} from './dto/phone-auth.dto';
import { RegisterDto } from './dto/register.dto';
import { FacebookLoginDto, GoogleLoginDto } from './dto/social-auth.dto';
import { AuthService } from './services/auth.service';
import { PhoneAuthService } from './services/phone-auth.service';
import { SocialAuthService } from './services/social-auth.service';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly phoneAuthService: PhoneAuthService,
    private readonly socialAuthService: SocialAuthService,
  ) {}

  // ---------------------------------------------------------------------------
  // Register
  // ---------------------------------------------------------------------------

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiWrappedResponse({
    status: 201,
    description: 'User successfully registered. Verification email sent.',
    type: MessageResponseDto,
  })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<MessageResponseDto> {
    return await this.authService.register(registerDto);
  }

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------

  @Post('login')
  // @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login with email/phone and password' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Login successful – returns JWT tokens and sanitized user.',
    type: AuthResponseDto,
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginDto);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get the currently authenticated user profile' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Authenticated user profile.',
    type: SanitizedUserDto,
  })
  async getMe(@CurrentUser() user: UserDocument): Promise<SanitizedUserDto> {
    return await this.authService.getMe(user._id.toString());
  }

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Logout – invalidates the stored refresh token' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Logout successful – refresh token cleared.',
    type: LogoutResponseDto,
  })
  async logout(
    @Request() req: { user: UserDocument },
  ): Promise<LogoutResponseDto> {
    return (await this.authService.logout(
      req.user._id.toString(),
    )) as unknown as LogoutResponseDto;
  }

  // ---------------------------------------------------------------------------
  // Refresh tokens
  // ---------------------------------------------------------------------------

  @Post('refresh')
  @ApiOperation({
    summary: 'Rotate JWT tokens using a valid refresh token',
    description:
      'Pass `refreshToken` in the request body **or** as an `httpOnly` cookie.',
  })
  @ApiWrappedResponse({
    status: 200,
    description: 'New access token and rotated refresh token.',
    type: AuthTokensResponseDto,
  })
  async refresh(
    @Body('refreshToken') refreshTokenFromReq: string,
    @Request() req: { cookies?: { refreshToken?: string } },
    @Res({ passthrough: true }) _res: Response,
  ): Promise<AuthTokensResponseDto> {
    const refreshToken = (refreshTokenFromReq ||
      req.cookies?.refreshToken) as string;
    return await this.authService.refreshTokens(refreshToken);
  }

  // ---------------------------------------------------------------------------
  // Email verification
  // ---------------------------------------------------------------------------

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email address using the one-time token' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Email verified successfully.',
    type: MessageResponseDto,
  })
  async verifyEmail(
    @Query('token') token: string,
  ): Promise<MessageResponseDto> {
    return await this.authService.verifyEmail({ token });
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend email verification link' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Verification email resent.',
    type: MessageResponseDto,
  })
  async resendVerification(
    @Body('email') email: string,
  ): Promise<MessageResponseDto> {
    return await this.authService.resendVerification(email);
  }

  // ---------------------------------------------------------------------------
  // Password Reset
  // ---------------------------------------------------------------------------

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Request password reset token via email' })
  @ApiWrappedResponse({
    status: 200,
    description:
      'Generates reset token and sends link if account exists with email.',
    type: MessageResponseDto,
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<MessageResponseDto> {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('verify-reset-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify if a password reset token is valid' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Returns valid true if token is valid and active.',
    type: MessageResponseDto,
  })
  async verifyResetToken(
    @Body() verifyResetTokenDto: VerifyResetTokenDto,
  ): Promise<MessageResponseDto> {
    await this.authService.verifyResetToken(verifyResetTokenDto.token);
    return { message: 'Reset token is valid.' };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using valid reset token' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Password reset successfully.',
    type: MessageResponseDto,
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  // ---------------------------------------------------------------------------
  // Phone Auth
  // ---------------------------------------------------------------------------

  @Post('phone/start')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Request an OTP to the given phone number' })
  @ApiWrappedResponse({
    status: 200,
    description: 'OTP sent successfully.',
    type: MessageResponseDto,
  })
  async phoneStart(
    @Body() phoneStartDto: PhoneStartDto,
  ): Promise<MessageResponseDto> {
    return await this.phoneAuthService.phoneStart(phoneStartDto);
  }

  @Post('phone/verify')
  @ApiOperation({
    summary: 'Verify OTP and authenticate (login or register) via phone',
  })
  async phoneVerify(
    @Body() phoneVerifyDto: PhoneVerifyDto,
    @Res({ passthrough: true }) _res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.phoneAuthService.phoneVerify(phoneVerifyDto);
    return result;
  }

  @Post('phone/resend')
  @ApiOperation({ summary: 'Resend OTP to the given phone number' })
  @ApiWrappedResponse({
    status: 200,
    description: 'OTP resent successfully.',
    type: MessageResponseDto,
  })
  async phoneResend(
    @Body() phoneResendDto: PhoneResendDto,
  ): Promise<MessageResponseDto> {
    return await this.phoneAuthService.resendPhoneOtp(
      phoneResendDto.phoneNumber,
    );
  }

  // ---------------------------------------------------------------------------
  // Social Auth
  // ---------------------------------------------------------------------------

  @Post('google')
  @ApiOperation({ summary: 'Authenticate using a Google ID token' })
  @ApiWrappedResponse({
    status: 200,
    description:
      'Google login successful – returns JWT tokens and sanitized user.',
    type: AuthResponseDto,
  })
  async googleLogin(
    @Body() googleLoginDto: GoogleLoginDto,
    @Res({ passthrough: true }) _res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.socialAuthService.googleLogin(googleLoginDto);
    // this.setRefreshTokenCookie(_res, result.refreshToken);
    return result;
  }

  @Post('facebook')
  @ApiOperation({ summary: 'Authenticate using a Facebook access token' })
  @ApiWrappedResponse({
    status: 200,

    description:
      'Facebook login successful – returns JWT tokens and sanitized user.',
    type: AuthResponseDto,
  })
  async facebookLogin(
    @Body() facebookLoginDto: FacebookLoginDto,
    @Res({ passthrough: true }) _res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.socialAuthService.facebookLogin(facebookLoginDto);
    // this.setRefreshTokenCookie(_res, result.refreshToken);
    return result;
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
