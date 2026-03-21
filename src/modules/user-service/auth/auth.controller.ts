import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiResponse({ status: 400, description: 'Bad Request – validation error' })
  @ApiResponse({ status: 409, description: 'Conflict – email already in use' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login with email/phone and password' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Login successful – returns JWT tokens and sanitized user.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request – email or phone required',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized – invalid credentials / account locked',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);
    // this.setRefreshTokenCookie(res, result.refreshToken);
    return result;
  }

  // ---------------------------------------------------------------------------
  // Me
  // ---------------------------------------------------------------------------

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get the currently authenticated user profile' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Authenticated user profile.',
    type: SanitizedUserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized – missing or invalid JWT',
  })
  async getMe(@CurrentUser() user: UserDocument) {
    return this.authService.getMe(user._id.toString());
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized – missing or invalid JWT',
  })
  async logout(@Request() req: { user: UserDocument }) {
    return this.authService.logout(req.user._id.toString());
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized – refresh token invalid or revoked',
  })
  async refresh(
    @Body('refreshToken') refreshTokenFromReq: string,
    @Request() req: { cookies?: { refreshToken?: string } },
    @Res({ passthrough: true }) _res: Response,
  ) {
    const refreshToken = (refreshTokenFromReq ||
      req.cookies?.refreshToken) as string;
    const tokens = await this.authService.refreshTokens(refreshToken);
    // this.setRefreshTokenCookie(_res, tokens.refreshToken);
    return tokens;
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
  @ApiResponse({
    status: 400,
    description: 'Bad Request – token invalid or expired',
  })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail({ token });
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend email verification link' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Verification email resent.',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request – user not found, already verified, or throttled',
  })
  async resendVerification(@Body('email') email: string) {
    return this.authService.resendVerification(email);
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
  @ApiResponse({
    status: 400,
    description: 'Bad Request – daily SMS limit reached',
  })
  async phoneStart(@Body() phoneStartDto: PhoneStartDto) {
    return this.phoneAuthService.phoneStart(phoneStartDto);
  }

  @Post('phone/verify')
  @ApiOperation({
    summary: 'Verify OTP and authenticate (login or register) via phone',
  })
  @ApiWrappedResponse({
    status: 200,
    description: 'Phone verified – returns JWT tokens and sanitized user.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request – invalid or expired OTP',
  })
  async phoneVerify(
    @Body() phoneVerifyDto: PhoneVerifyDto,
    @Res({ passthrough: true }) _res: Response,
  ) {
    const result = await this.phoneAuthService.phoneVerify(phoneVerifyDto);
    // this.setRefreshTokenCookie(res, result.refreshToken);
    return result;
  }

  @Post('phone/resend')
  @ApiOperation({ summary: 'Resend OTP to the given phone number' })
  @ApiWrappedResponse({
    status: 200,
    description: 'OTP resent successfully.',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request – daily SMS limit reached',
  })
  async phoneResend(@Body() phoneResendDto: PhoneResendDto) {
    return this.phoneAuthService.resendPhoneOtp(phoneResendDto.phoneNumber);
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized – invalid Google ID token',
  })
  async googleLogin(
    @Body() googleLoginDto: GoogleLoginDto,
    @Res({ passthrough: true }) _res: Response,
  ) {
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
  @ApiResponse({
    status: 400,
    description: 'Bad Request – email not provided by Facebook',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized – invalid Facebook access token',
  })
  async facebookLogin(
    @Body() facebookLoginDto: FacebookLoginDto,
    @Res({ passthrough: true }) _res: Response,
  ) {
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
