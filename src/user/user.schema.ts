import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

// ---------- ENUMS ----------
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum RoleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
  PENDING = 'PENDING',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum Language {
  EN = 'EN',
  BN = 'BN',
}

// ---------- SUB_DOCUMENTS ----------
class Role {
  @Prop({ type: String, enum: UserRole, required: true })
  type: UserRole;

  @Prop({ type: String, enum: RoleStatus, default: RoleStatus.PENDING })
  status: RoleStatus;

  @Prop({ type: Date, default: Date.now })
  assignedAt: Date;

  @Prop({ type: Object })
  metadata?: Record<string, unknown>;
}

class Profile {
  @Prop({ required: true })
  fullName: string;

  @Prop()
  imageUrl?: string;

  @Prop({ type: Date })
  dateOfBirth?: Date;

  @Prop({ type: String, enum: Gender })
  gender?: Gender;
}

class Verification {
  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: false })
  phoneVerified: boolean;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  phoneVerificationToken?: string;

  @Prop()
  emailVerifiedAt?: Date;

  @Prop()
  phoneVerifiedAt?: Date;
}

class Security {
  @Prop()
  lastLoginAt?: Date;

  @Prop()
  passwordChangedAt?: Date;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop({ default: false })
  twoFactorEnabled: boolean;

  @Prop()
  twoFactorSecret?: string;

  @Prop({ default: 0 })
  failedLoginAttempts: number;

  @Prop()
  lockUntil?: Date;
}

class NotificationSettings {
  @Prop({ default: true })
  email: boolean;

  @Prop({ default: false })
  sms: boolean;

  @Prop({ default: true })
  push: boolean;
}

class Preferences {
  @Prop({ type: String, enum: Language, default: 'en' })
  language: Language;

  @Prop({ default: 'BDT' })
  currency: string;

  @Prop({ type: NotificationSettings, default: {} })
  notifications: NotificationSettings;
}

// ---------- MAIN USER SCHEMA ----------
@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [Role], default: [] })
  roles: Role[];

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  primaryRole: UserRole;

  @Prop({ type: Profile, required: true })
  profile: Profile;

  @Prop({
    type: String,
    enum: AccountStatus,
    default: AccountStatus.PENDING,
  })
  accountStatus: AccountStatus;

  @Prop({ type: Verification, default: {} })
  verification: Verification;

  @Prop({ type: Security, default: {} })
  security: Security;

  @Prop({ type: Preferences, default: {} })
  preferences: Preferences;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;

  @Prop()
  deletedBy?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phoneNumber: 1 }, { unique: true });
UserSchema.index({ 'roles.type': 1 });
UserSchema.index({ primaryRole: 1, accountStatus: 1 });
UserSchema.index(
  { 'roles.metadata.referralCode': 1 },
  { unique: true, sparse: true },
);
UserSchema.index({ createdAt: -1 });
UserSchema.index({ isDeleted: 1, accountStatus: 1 });
