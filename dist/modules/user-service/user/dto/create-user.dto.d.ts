import { AccountStatus, AuthProvider } from '../user.schema';
export declare class CreateProfileDto {
    fullName: string;
    imageUrl?: string;
    dateOfBirth?: Date;
    gender?: string;
}
export declare class CreateRoleDto {
    type: string;
}
export declare class CreateUserDto {
    email?: string;
    phoneNumber?: string;
    password: string;
    provider?: AuthProvider;
    googleId?: string;
    facebookId?: string;
    accountStatus?: AccountStatus;
    roles?: CreateRoleDto[];
    primaryRole?: string;
    profile: CreateProfileDto;
}
