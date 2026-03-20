import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { AccountStatus } from 'src/modules/user-service/user/user.schema';
import { UserService } from 'src/modules/user-service/user/user.service';
import { PhoneStartDto, PhoneVerifyDto } from '../dto/phone-auth.dto';
import { OtpLogDocument } from '../schemas/otp-log.schema';
import { OtpDocument } from '../schemas/otp.schema';
import { AuthService } from './auth.service';
export declare class PhoneAuthService {
    private readonly userService;
    private readonly eventEmitter;
    private readonly authService;
    private readonly otpModel;
    private readonly otpLogModel;
    private readonly logger;
    constructor(userService: UserService, eventEmitter: EventEmitter2, authService: AuthService, otpModel: Model<OtpDocument>, otpLogModel: Model<OtpLogDocument>);
    phoneStart(payload: PhoneStartDto): Promise<{
        message: string;
    }>;
    phoneVerify(payload: PhoneVerifyDto): Promise<{
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
    resendPhoneOtp(phoneNumber: string): Promise<{
        message: string;
    }>;
}
