import { HydratedDocument, Types } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
import { UserRole } from 'src/common/interface';
export { UserRole };
export declare enum RoleStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    PENDING = "PENDING"
}
export declare enum AccountStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    BLOCKED = "BLOCKED",
    DELETED = "DELETED",
    PENDING = "PENDING",
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
}
export declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}
export declare enum Language {
    EN = "EN",
    BN = "BN"
}
export declare enum AuthProvider {
    LOCAL = "local",
    GOOGLE = "google",
    FACEBOOK = "facebook"
}
declare class Role {
    type: UserRole;
    status: RoleStatus;
    assignedAt: Date;
    metadata?: Record<string, unknown>;
}
declare class Profile {
    fullName: string;
    imageUrl?: string;
    dateOfBirth?: Date;
    gender?: Gender;
}
declare class Verification {
    emailVerified: boolean;
    phoneVerified: boolean;
    emailVerificationToken?: string;
    phoneVerificationToken?: string;
    emailVerifiedAt?: Date;
    phoneVerifiedAt?: Date;
}
declare class Security {
    lastLoginAt?: Date;
    passwordChangedAt?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    twoFactorEnabled: boolean;
    twoFactorSecret?: string;
    failedLoginAttempts: number;
    lockUntil?: Date;
    refreshTokenHash?: string;
}
declare class NotificationSettings {
    email: boolean;
    sms: boolean;
    push: boolean;
}
declare class Preferences {
    language: Language;
    currency: string;
    notifications: NotificationSettings;
}
export declare class User {
    _id: Types.ObjectId;
    email?: string;
    phoneNumber?: string;
    provider: AuthProvider;
    googleId?: string;
    facebookId?: string;
    password: string;
    roles: Role[];
    primaryRole: UserRole;
    profile: Profile;
    accountStatus: AccountStatus;
    verification: Verification;
    security: Security;
    preferences: Preferences;
    isDeleted: boolean;
    deletedAt?: Date;
    deletedBy?: Types.ObjectId;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User, any, {}> & User & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
