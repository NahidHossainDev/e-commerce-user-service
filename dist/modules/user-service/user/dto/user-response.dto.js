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
exports.PaginatedUsersResponseDto = exports.PaginationMetaDto = exports.UserResponseDto = exports.UserVerificationResponseDto = exports.UserRoleResponseDto = exports.UserProfileResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_schema_1 = require("../user.schema");
class UserProfileResponseDto {
    fullName;
    imageUrl;
    dateOfBirth;
    gender;
}
exports.UserProfileResponseDto = UserProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://ibb.co/5WHkfvR4' }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1998-07-21' }),
    __metadata("design:type", Date)
], UserProfileResponseDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: user_schema_1.Gender, example: user_schema_1.Gender.MALE }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "gender", void 0);
class UserRoleResponseDto {
    type;
    status;
    assignedAt;
}
exports.UserRoleResponseDto = UserRoleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_schema_1.UserRole, example: user_schema_1.UserRole.CUSTOMER }),
    __metadata("design:type", String)
], UserRoleResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ACTIVE' }),
    __metadata("design:type", String)
], UserRoleResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], UserRoleResponseDto.prototype, "assignedAt", void 0);
class UserVerificationResponseDto {
    emailVerified;
    phoneVerified;
    emailVerifiedAt;
    phoneVerifiedAt;
}
exports.UserVerificationResponseDto = UserVerificationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], UserVerificationResponseDto.prototype, "emailVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], UserVerificationResponseDto.prototype, "phoneVerified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], UserVerificationResponseDto.prototype, "emailVerifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], UserVerificationResponseDto.prototype, "phoneVerifiedAt", void 0);
class UserResponseDto {
    _id;
    email;
    phoneNumber;
    provider;
    googleId;
    facebookId;
    accountStatus;
    primaryRole;
    profile;
    roles;
    verification;
    createdAt;
    updatedAt;
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e1' }),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'user@example.com' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+8801700000000' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_schema_1.AuthProvider, example: user_schema_1.AuthProvider.LOCAL }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'google_sub_id' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "googleId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'facebook_user_id' }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "facebookId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_schema_1.AccountStatus, example: user_schema_1.AccountStatus.ACTIVE }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "accountStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_schema_1.UserRole, example: user_schema_1.UserRole.CUSTOMER }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "primaryRole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserProfileResponseDto }),
    __metadata("design:type", UserProfileResponseDto)
], UserResponseDto.prototype, "profile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UserRoleResponseDto] }),
    __metadata("design:type", Array)
], UserResponseDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserVerificationResponseDto }),
    __metadata("design:type", UserVerificationResponseDto)
], UserResponseDto.prototype, "verification", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "updatedAt", void 0);
class PaginationMetaDto {
    totalCount;
    totalPages;
    limit;
    page;
    nextPage;
}
exports.PaginationMetaDto = PaginationMetaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PaginationMetaDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, nullable: true }),
    __metadata("design:type", Object)
], PaginationMetaDto.prototype, "nextPage", void 0);
class PaginatedUsersResponseDto {
    data;
    meta;
}
exports.PaginatedUsersResponseDto = PaginatedUsersResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UserResponseDto] }),
    __metadata("design:type", Array)
], PaginatedUsersResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PaginationMetaDto }),
    __metadata("design:type", PaginationMetaDto)
], PaginatedUsersResponseDto.prototype, "meta", void 0);
//# sourceMappingURL=user-response.dto.js.map