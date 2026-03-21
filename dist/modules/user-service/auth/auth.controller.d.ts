import { Response } from 'express';
import { UserDocument } from '../user/user.schema';
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
    register(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
        user: ReturnType<AuthService["sanitizeUser"]>;
    }>;
    getMe(user: UserDocument): Promise<{
        _id: import("mongoose").Types.ObjectId;
        email: string | undefined;
        phoneNumber: string | undefined;
        profile: {
            fullName: string;
            imageUrl?: string;
            dateOfBirth?: Date;
            gender?: import("../user/user.schema").Gender;
        };
        roles: {
            type: import("../user/user.schema").UserRole;
            status: import("../user/user.schema").RoleStatus;
            assignedAt: Date;
            metadata?: Record<string, unknown>;
        }[];
        primaryRole: import("../user/user.schema").UserRole;
        accountStatus: import("../user/user.schema").AccountStatus;
    }>;
    logout(req: {
        user: UserDocument;
    }): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../user/user.schema").User, {}, {}> & import("../user/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../user/user.schema").User, {}, {}> & import("../user/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    refresh(refreshTokenFromReq: string, req: any, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
    phoneStart(phoneStartDto: PhoneStartDto): Promise<{
        message: string;
    }>;
    phoneVerify(phoneVerifyDto: PhoneVerifyDto, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string | undefined;
            phoneNumber: string | undefined;
            profile: {
                fullName: string;
                imageUrl?: string;
                dateOfBirth?: Date;
                gender?: import("../user/user.schema").Gender;
            };
            roles: {
                type: import("../user/user.schema").UserRole;
                status: import("../user/user.schema").RoleStatus;
                assignedAt: Date;
                metadata?: Record<string, unknown>;
            }[];
            primaryRole: import("../user/user.schema").UserRole;
            accountStatus: import("../user/user.schema").AccountStatus;
        };
    }>;
    phoneResend(phoneResendDto: PhoneResendDto): Promise<{
        message: string;
    }>;
    googleLogin(googleLoginDto: GoogleLoginDto, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string | undefined;
            phoneNumber: string | undefined;
            profile: {
                fullName: string;
                imageUrl?: string;
                dateOfBirth?: Date;
                gender?: import("../user/user.schema").Gender;
            };
            roles: {
                type: import("../user/user.schema").UserRole;
                status: import("../user/user.schema").RoleStatus;
                assignedAt: Date;
                metadata?: Record<string, unknown>;
            }[];
            primaryRole: import("../user/user.schema").UserRole;
            accountStatus: import("../user/user.schema").AccountStatus;
        };
    }>;
    facebookLogin(facebookLoginDto: FacebookLoginDto, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            _id: import("mongoose").Types.ObjectId;
            email: string | undefined;
            phoneNumber: string | undefined;
            profile: {
                fullName: string;
                imageUrl?: string;
                dateOfBirth?: Date;
                gender?: import("../user/user.schema").Gender;
            };
            roles: {
                type: import("../user/user.schema").UserRole;
                status: import("../user/user.schema").RoleStatus;
                assignedAt: Date;
                metadata?: Record<string, unknown>;
            }[];
            primaryRole: import("../user/user.schema").UserRole;
            accountStatus: import("../user/user.schema").AccountStatus;
        };
    }>;
    private setRefreshTokenCookie;
}
