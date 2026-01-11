import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { HydratedDocument, Types } from 'mongoose';
import { config } from 'src/config';

export type UserDocument = HydratedDocument<User>;

import { UserRole } from 'src/common/interface';
export { UserRole };

// ---------- ENUMS ----------

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
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
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

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

// ---------- SUB_DOCUMENTS ----------
@Schema({ _id: false })
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
@Schema({ _id: false })
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
@Schema({ _id: false })
class Verification {
  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: false })
  phoneVerified: boolean;

  @Prop({ select: false })
  emailVerificationToken?: string;

  @Prop({ select: false })
  phoneVerificationToken?: string;

  @Prop()
  emailVerifiedAt?: Date;

  @Prop()
  phoneVerifiedAt?: Date;
}
@Schema({ _id: false })
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

  @Prop()
  refreshTokenHash?: string;
}
@Schema({ _id: false })
class NotificationSettings {
  @Prop({ default: true })
  email: boolean;

  @Prop({ default: false })
  sms: boolean;

  @Prop({ default: true })
  push: boolean;
}
@Schema({ _id: false })
class Preferences {
  @Prop({ type: String, enum: Language, default: Language.EN })
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

  @Prop({ required: false, unique: true, lowercase: true, sparse: true })
  email?: string;

  @Prop({ required: false, unique: true, sparse: true })
  phoneNumber?: string;

  @Prop({
    type: String,
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  provider: AuthProvider;

  @Prop({ required: false, unique: true, sparse: true })
  googleId?: string;

  @Prop({ required: false, unique: true, sparse: true })
  facebookId?: string;

  @Prop({ required: true, select: false })
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

  @Prop({ type: Security, default: {}, select: false })
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

UserSchema.pre('save', async function (this: UserDocument) {
  this.password = await bcrypt?.hash(this.password, Number(config.saltRound));
  if (this.security.passwordChangedAt)
    this.security.passwordChangedAt = new Date();
});

// UserSchema.index({ email: 1 }, { unique: true });
// UserSchema.index({ phoneNumber: 1 }, { unique: true });
// UserSchema.index({ 'roles.type': 1 });
// UserSchema.index({ primaryRole: 1, accountStatus: 1 });
// UserSchema.index(
//   { 'roles.metadata.referralCode': 1 },
//   { unique: true, sparse: true },
// );
// UserSchema.index({ createdAt: -1 });
// UserSchema.index({ isDeleted: 1, accountStatus: 1 });
