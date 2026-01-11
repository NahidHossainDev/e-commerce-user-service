import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserDocument } from '../user/user.schema';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  PhoneResendDto,
  PhoneStartDto,
  PhoneVerifyDto,
} from './dto/phone-auth.dto';
import { RegisterDto } from './dto/register.dto';
import { FacebookLoginDto, GoogleLoginDto } from './dto/social-auth.dto';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({
    status: 409,
    description: 'Conflict (Email/Phone already exists)',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Request() req: { user: UserDocument }) {
    return this.authService.logout(req.user._id.toString());
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh tokens' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email with token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail({ token });
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({ status: 200, description: 'Verification email resent' })
  async resendVerification(@Body('email') email: string) {
    return this.authService.resendVerification(email);
  }

  // --- Phone Auth ---

  @Post('phone/start')
  @ApiOperation({ summary: 'Start phone registration/OTP request' })
  @ApiResponse({ status: 200, description: 'OTP sent' })
  async phoneStart(@Body() phoneStartDto: PhoneStartDto) {
    return this.authService.phoneStart(phoneStartDto);
  }

  @Post('phone/verify')
  @ApiOperation({ summary: 'Verify phone OTP and login/register' })
  @ApiResponse({ status: 200, description: 'Phone verified and logged in' })
  async phoneVerify(@Body() phoneVerifyDto: PhoneVerifyDto) {
    return this.authService.phoneVerify(phoneVerifyDto);
  }

  @Post('phone/resend')
  @ApiOperation({ summary: 'Resend phone OTP' })
  @ApiResponse({ status: 200, description: 'OTP resent' })
  async phoneResend(@Body() phoneResendDto: PhoneResendDto) {
    return this.authService.resendPhoneOtp(phoneResendDto.phoneNumber);
  }

  // --- Social Auth ---

  @Post('google')
  @ApiOperation({ summary: 'Google OAuth login' })
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    return this.authService.googleLogin(googleLoginDto);
  }

  @Post('facebook')
  @ApiOperation({ summary: 'Facebook OAuth login' })
  async facebookLogin(@Body() facebookLoginDto: FacebookLoginDto) {
    return this.authService.facebookLogin(facebookLoginDto);
  }
}
