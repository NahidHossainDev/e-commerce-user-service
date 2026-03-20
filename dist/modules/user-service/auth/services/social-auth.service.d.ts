import { AccountStatus } from 'src/modules/user-service/user/user.schema';
import { UserService } from 'src/modules/user-service/user/user.service';
import { FacebookLoginDto, GoogleLoginDto } from '../dto/social-auth.dto';
import { AuthService } from './auth.service';
export declare class SocialAuthService {
    private readonly userService;
    private readonly authService;
    private readonly logger;
    constructor(userService: UserService, authService: AuthService);
    googleLogin(payload: GoogleLoginDto): Promise<{
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
                gender?: import("src/modules/user-service/user/user.schema").Gender;
            };
            roles: {
                type: import("src/modules/user-service/user/user.schema").UserRole;
                status: import("src/modules/user-service/user/user.schema").RoleStatus;
                assignedAt: Date;
                metadata?: Record<string, unknown>;
            }[];
            primaryRole: import("src/modules/user-service/user/user.schema").UserRole;
            accountStatus: AccountStatus;
        };
    }>;
    facebookLogin(payload: FacebookLoginDto): Promise<{
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
                gender?: import("src/modules/user-service/user/user.schema").Gender;
            };
            roles: {
                type: import("src/modules/user-service/user/user.schema").UserRole;
                status: import("src/modules/user-service/user/user.schema").RoleStatus;
                assignedAt: Date;
                metadata?: Record<string, unknown>;
            }[];
            primaryRole: import("src/modules/user-service/user/user.schema").UserRole;
            accountStatus: AccountStatus;
        };
    }>;
    private verifyGoogleToken;
    private verifyFacebookToken;
}
