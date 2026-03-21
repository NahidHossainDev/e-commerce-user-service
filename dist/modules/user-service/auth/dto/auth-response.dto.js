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
exports.LogoutResponseDto = exports.MessageResponseDto = exports.AuthResponseDto = exports.AuthTokensResponseDto = exports.SanitizedUserDto = exports.UserProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_schema_1 = require("../../user/user.schema");
class UserProfileDto {
    fullName;
    avatarUrl;
}
exports.UserProfileDto = UserProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/avatar.jpg', required: false }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "avatarUrl", void 0);
class SanitizedUserDto {
    _id;
    email;
    phoneNumber;
    profile;
    roles;
    primaryRole;
    accountStatus;
}
exports.SanitizedUserDto = SanitizedUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e1' }),
    __metadata("design:type", Object)
], SanitizedUserDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com', required: false }),
    __metadata("design:type", String)
], SanitizedUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+8801700000000', required: false }),
    __metadata("design:type", String)
], SanitizedUserDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserProfileDto }),
    __metadata("design:type", UserProfileDto)
], SanitizedUserDto.prototype, "profile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true }),
    __metadata("design:type", Array)
], SanitizedUserDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_schema_1.UserRole, example: user_schema_1.UserRole.CUSTOMER }),
    __metadata("design:type", String)
], SanitizedUserDto.prototype, "primaryRole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_schema_1.AccountStatus, example: user_schema_1.AccountStatus.ACTIVE }),
    __metadata("design:type", String)
], SanitizedUserDto.prototype, "accountStatus", void 0);
class AuthTokensResponseDto {
    accessToken;
    refreshToken;
}
exports.AuthTokensResponseDto = AuthTokensResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Short-lived JWT access token',
    }),
    __metadata("design:type", String)
], AuthTokensResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Long-lived JWT refresh token (7 days)',
    }),
    __metadata("design:type", String)
], AuthTokensResponseDto.prototype, "refreshToken", void 0);
class AuthResponseDto extends AuthTokensResponseDto {
    user;
}
exports.AuthResponseDto = AuthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: SanitizedUserDto }),
    __metadata("design:type", SanitizedUserDto)
], AuthResponseDto.prototype, "user", void 0);
class MessageResponseDto {
    message;
}
exports.MessageResponseDto = MessageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'We sent you a verification email. Please verify to continue.',
    }),
    __metadata("design:type", String)
], MessageResponseDto.prototype, "message", void 0);
class LogoutResponseDto {
    acknowledged;
    modifiedCount;
}
exports.LogoutResponseDto = LogoutResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], LogoutResponseDto.prototype, "acknowledged", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], LogoutResponseDto.prototype, "modifiedCount", void 0);
//# sourceMappingURL=auth-response.dto.js.map