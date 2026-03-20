import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user-service/user/user.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { AccountStatus, UserDocument, UserRole } from '../../user/user.schema';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { VerificationTokenDocument } from '../schemas/verification-token.schema';
export declare class AuthService {
    private userService;
    private jwtService;
    private eventEmitter;
    private verificationTokenModel;
    private readonly logger;
    constructor(userService: UserService, jwtService: JwtService, eventEmitter: EventEmitter2, verificationTokenModel: Model<VerificationTokenDocument>);
    register(payload: RegisterDto): Promise<{
        message: string;
    }>;
    verifyEmail(payload: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: ReturnType<AuthService['sanitizeUser']>;
    }>;
    logout(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../user/user.schema").User, {}, {}> & import("../../user/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../../user/user.schema").User, {}, {}> & import("../../user/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    issueTokens(user: UserDocument): Promise<{
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
                gender?: import("../../user/user.schema").Gender;
            };
            roles: {
                type: UserRole;
                status: import("../../user/user.schema").RoleStatus;
                assignedAt: Date;
                metadata?: Record<string, unknown>;
            }[];
            primaryRole: UserRole;
            accountStatus: AccountStatus;
        };
    }>;
    sanitizeUser(user: UserDocument): {
        _id: import("mongoose").Types.ObjectId;
        email: string | undefined;
        phoneNumber: string | undefined;
        profile: {
            fullName: string;
            imageUrl?: string;
            dateOfBirth?: Date;
            gender?: import("../../user/user.schema").Gender;
        };
        roles: {
            type: UserRole;
            status: import("../../user/user.schema").RoleStatus;
            assignedAt: Date;
            metadata?: Record<string, unknown>;
        }[];
        primaryRole: UserRole;
        accountStatus: AccountStatus;
    };
    getMe(userId: string): Promise<{
        _id: import("mongoose").Types.ObjectId;
        email: string | undefined;
        phoneNumber: string | undefined;
        profile: {
            fullName: string;
            imageUrl?: string;
            dateOfBirth?: Date;
            gender?: import("../../user/user.schema").Gender;
        };
        roles: {
            type: UserRole;
            status: import("../../user/user.schema").RoleStatus;
            assignedAt: Date;
            metadata?: Record<string, unknown>;
        }[];
        primaryRole: UserRole;
        accountStatus: AccountStatus;
    }>;
    private createVerificationToken;
}
