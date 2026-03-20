import { AccountStatus, UserRole } from 'src/modules/user-service/user/user.schema';
export declare class AuthUserResponseDto {
    _id: string;
    email: string;
    phoneNumber: string;
    profile: any;
    roles: any[];
    primaryRole: UserRole;
    accountStatus: AccountStatus;
    constructor(partial: Partial<AuthUserResponseDto>);
}
