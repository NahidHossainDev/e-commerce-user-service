"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.User = exports.AuthProvider = exports.Language = exports.Gender = exports.AccountStatus = exports.RoleStatus = exports.UserRole = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const mongoose_2 = require("mongoose");
const config_1 = require("../../../config");
const interface_1 = require("../../../common/interface");
Object.defineProperty(exports, "UserRole", { enumerable: true, get: function () { return interface_1.UserRole; } });
var RoleStatus;
(function (RoleStatus) {
    RoleStatus["ACTIVE"] = "ACTIVE";
    RoleStatus["INACTIVE"] = "INACTIVE";
    RoleStatus["SUSPENDED"] = "SUSPENDED";
    RoleStatus["PENDING"] = "PENDING";
})(RoleStatus || (exports.RoleStatus = RoleStatus = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["INACTIVE"] = "INACTIVE";
    AccountStatus["SUSPENDED"] = "SUSPENDED";
    AccountStatus["BLOCKED"] = "BLOCKED";
    AccountStatus["DELETED"] = "DELETED";
    AccountStatus["PENDING"] = "PENDING";
    AccountStatus["PENDING_VERIFICATION"] = "PENDING_VERIFICATION";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHER"] = "OTHER";
})(Gender || (exports.Gender = Gender = {}));
var Language;
(function (Language) {
    Language["EN"] = "EN";
    Language["BN"] = "BN";
})(Language || (exports.Language = Language = {}));
var AuthProvider;
(function (AuthProvider) {
    AuthProvider["LOCAL"] = "local";
    AuthProvider["GOOGLE"] = "google";
    AuthProvider["FACEBOOK"] = "facebook";
})(AuthProvider || (exports.AuthProvider = AuthProvider = {}));
let Role = class Role {
    type;
    status;
    assignedAt;
    metadata;
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: interface_1.UserRole, required: true }),
    __metadata("design:type", String)
], Role.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: RoleStatus, default: RoleStatus.PENDING }),
    __metadata("design:type", String)
], Role.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Role.prototype, "assignedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Role.prototype, "metadata", void 0);
Role = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Role);
let Profile = class Profile {
    fullName;
    imageUrl;
    dateOfBirth;
    gender;
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Profile.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Profile.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Profile.prototype, "dateOfBirth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: Gender }),
    __metadata("design:type", String)
], Profile.prototype, "gender", void 0);
Profile = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Profile);
let Verification = class Verification {
    emailVerified;
    phoneVerified;
    emailVerificationToken;
    phoneVerificationToken;
    emailVerifiedAt;
    phoneVerifiedAt;
};
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Verification.prototype, "emailVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Verification.prototype, "phoneVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ select: false }),
    __metadata("design:type", String)
], Verification.prototype, "emailVerificationToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ select: false }),
    __metadata("design:type", String)
], Verification.prototype, "phoneVerificationToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Verification.prototype, "emailVerifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Verification.prototype, "phoneVerifiedAt", void 0);
Verification = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Verification);
let Security = class Security {
    lastLoginAt;
    passwordChangedAt;
    passwordResetToken;
    passwordResetExpires;
    twoFactorEnabled;
    twoFactorSecret;
    failedLoginAttempts;
    lockUntil;
    refreshTokenHash;
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Security.prototype, "lastLoginAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Security.prototype, "passwordChangedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Security.prototype, "passwordResetToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Security.prototype, "passwordResetExpires", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Security.prototype, "twoFactorEnabled", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Security.prototype, "twoFactorSecret", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Security.prototype, "failedLoginAttempts", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Security.prototype, "lockUntil", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Security.prototype, "refreshTokenHash", void 0);
Security = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Security);
let NotificationSettings = class NotificationSettings {
    email;
    sms;
    push;
};
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], NotificationSettings.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], NotificationSettings.prototype, "sms", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], NotificationSettings.prototype, "push", void 0);
NotificationSettings = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], NotificationSettings);
let Preferences = class Preferences {
    language;
    currency;
    notifications;
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: Language, default: Language.EN }),
    __metadata("design:type", String)
], Preferences.prototype, "language", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'BDT' }),
    __metadata("design:type", String)
], Preferences.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: NotificationSettings, default: {} }),
    __metadata("design:type", NotificationSettings)
], Preferences.prototype, "notifications", void 0);
Preferences = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Preferences);
let User = class User {
    _id;
    email;
    phoneNumber;
    provider;
    googleId;
    facebookId;
    password;
    roles;
    primaryRole;
    profile;
    accountStatus;
    verification;
    security;
    preferences;
    isDeleted;
    deletedAt;
    deletedBy;
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: false, unique: true, lowercase: true, sparse: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, unique: true, sparse: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: AuthProvider,
        default: AuthProvider.LOCAL,
    }),
    __metadata("design:type", String)
], User.prototype, "provider", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, unique: true, sparse: true }),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, unique: true, sparse: true }),
    __metadata("design:type", String)
], User.prototype, "facebookId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Role], default: [] }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: interface_1.UserRole,
        default: interface_1.UserRole.CUSTOMER,
    }),
    __metadata("design:type", String)
], User.prototype, "primaryRole", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Profile, required: true }),
    __metadata("design:type", Profile)
], User.prototype, "profile", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: AccountStatus,
        default: AccountStatus.PENDING,
    }),
    __metadata("design:type", String)
], User.prototype, "accountStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Verification, default: {} }),
    __metadata("design:type", Verification)
], User.prototype, "verification", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Security, default: {}, select: false }),
    __metadata("design:type", Security)
], User.prototype, "security", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Preferences, default: {} }),
    __metadata("design:type", Preferences)
], User.prototype, "preferences", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isDeleted", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], User.prototype, "deletedBy", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.pre('save', async function () {
    this.password = await bcrypt?.hash(this.password, Number(config_1.config.saltRound));
    if (this.security.passwordChangedAt)
        this.security.passwordChangedAt = new Date();
});
//# sourceMappingURL=user.schema.js.map