import { AccountStatus, AuthProvider, Gender, UserRole } from '../user.schema';
export declare class UserProfileResponseDto {
    fullName: string;
    imageUrl?: string;
    dateOfBirth?: Date;
    gender?: Gender;
}
export declare class UserRoleResponseDto {
    type: UserRole;
    status: string;
    assignedAt: Date;
}
export declare class UserVerificationResponseDto {
    emailVerified: boolean;
    phoneVerified: boolean;
    emailVerifiedAt?: Date;
    phoneVerifiedAt?: Date;
}
export declare class UserResponseDto {
    _id: any;
    email?: string;
    phoneNumber?: string;
    provider: AuthProvider;
    googleId?: string;
    facebookId?: string;
    accountStatus: AccountStatus;
    primaryRole: UserRole;
    profile: UserProfileResponseDto;
    roles: UserRoleResponseDto[];
    verification: UserVerificationResponseDto;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PaginationMetaDto {
    totalCount: number;
    totalPages: number;
    limit: number;
    page: number;
    nextPage: number | null;
}
export declare class PaginatedUsersResponseDto {
    data: UserResponseDto[];
    meta: PaginationMetaDto;
}
