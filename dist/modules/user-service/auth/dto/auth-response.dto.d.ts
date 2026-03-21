import { AccountStatus, UserRole } from '../../user/user.schema';
export declare class UserProfileDto {
    fullName: string;
    avatarUrl?: string;
}
export declare class SanitizedUserDto {
    _id: string;
    email?: string;
    phoneNumber?: string;
    profile: UserProfileDto;
    roles: string[];
    primaryRole: UserRole;
    accountStatus: AccountStatus;
}
export declare class AuthTokensResponseDto {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthResponseDto extends AuthTokensResponseDto {
    user: SanitizedUserDto;
}
export declare class MessageResponseDto {
    message: string;
}
export declare class LogoutResponseDto {
    acknowledged: boolean;
    modifiedCount: number;
}
