import { Response } from 'express';
import { UserDocument } from '../user/user.schema';
import { AuthResponseDto, AuthTokensResponseDto, LogoutResponseDto, MessageResponseDto, SanitizedUserDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { PhoneResendDto, PhoneStartDto, PhoneVerifyDto } from './dto/phone-auth.dto';
import { RegisterDto } from './dto/register.dto';
import { FacebookLoginDto, GoogleLoginDto } from './dto/social-auth.dto';
import { AuthService } from './services/auth.service';
import { PhoneAuthService } from './services/phone-auth.service';
import { SocialAuthService } from './services/social-auth.service';
export declare class AuthController {
    private readonly authService;
    private readonly phoneAuthService;
    private readonly socialAuthService;
    constructor(authService: AuthService, phoneAuthService: PhoneAuthService, socialAuthService: SocialAuthService);
    register(registerDto: RegisterDto): Promise<MessageResponseDto>;
    login(loginDto: LoginDto, res: Response): Promise<AuthResponseDto>;
    getMe(user: UserDocument): Promise<SanitizedUserDto>;
    logout(req: {
        user: UserDocument;
    }): Promise<LogoutResponseDto>;
    refresh(refreshTokenFromReq: string, req: {
        cookies?: {
            refreshToken?: string;
        };
    }, _res: Response): Promise<AuthTokensResponseDto>;
    verifyEmail(token: string): Promise<MessageResponseDto>;
    resendVerification(email: string): Promise<MessageResponseDto>;
    phoneStart(phoneStartDto: PhoneStartDto): Promise<MessageResponseDto>;
    phoneVerify(phoneVerifyDto: PhoneVerifyDto, _res: Response): Promise<AuthResponseDto>;
    phoneResend(phoneResendDto: PhoneResendDto): Promise<MessageResponseDto>;
    googleLogin(googleLoginDto: GoogleLoginDto, _res: Response): Promise<AuthResponseDto>;
    facebookLogin(facebookLoginDto: FacebookLoginDto, _res: Response): Promise<AuthResponseDto>;
    private setRefreshTokenCookie;
}
