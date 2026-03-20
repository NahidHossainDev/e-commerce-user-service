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
exports.CreateUserDto = exports.CreateRoleDto = exports.CreateProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const user_schema_1 = require("../user.schema");
class CreateProfileDto {
    fullName;
    imageUrl;
    dateOfBirth;
    gender;
}
exports.CreateProfileDto = CreateProfileDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ type: String, required: true, example: 'Jone Doe' }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ type: String, example: 'https://ibb.co/5WHkfvR4' }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, swagger_1.ApiProperty)({ type: String, required: false, example: '1998-07-21' }),
    __metadata("design:type", Date)
], CreateProfileDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_schema_1.Gender),
    (0, swagger_1.ApiProperty)({ type: String, example: user_schema_1.Gender.MALE }),
    __metadata("design:type", String)
], CreateProfileDto.prototype, "gender", void 0);
class CreateRoleDto {
    type;
}
exports.CreateRoleDto = CreateRoleDto;
__decorate([
    (0, class_validator_1.IsEnum)(user_schema_1.UserRole),
    (0, swagger_1.ApiProperty)({ type: String, example: user_schema_1.UserRole.CUSTOMER }),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "type", void 0);
class CreateUserDto {
    email;
    phoneNumber;
    password;
    provider;
    googleId;
    facebookId;
    accountStatus;
    roles;
    primaryRole;
    profile;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ type: String, required: false, example: 'example@email.com' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)('BD'),
    (0, swagger_1.ApiProperty)({ type: String, required: false, example: '+880123456789' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ type: String, required: true, example: 'secrete-password' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_schema_1.AuthProvider),
    (0, swagger_1.ApiProperty)({
        type: String,
        enum: user_schema_1.AuthProvider,
        example: user_schema_1.AuthProvider.LOCAL,
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "provider", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ type: String, required: false }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "googleId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ type: String, required: false }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "facebookId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_schema_1.AccountStatus),
    (0, swagger_1.ApiProperty)({
        type: String,
        enum: user_schema_1.AccountStatus,
        example: user_schema_1.AccountStatus.PENDING_VERIFICATION,
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "accountStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateRoleDto),
    (0, swagger_1.ApiProperty)({
        type: [CreateRoleDto],
        example: [{ type: user_schema_1.UserRole.CUSTOMER }],
    }),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "roles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_schema_1.UserRole),
    (0, swagger_1.ApiProperty)({
        type: String,
        example: user_schema_1.UserRole.CUSTOMER,
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "primaryRole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: CreateProfileDto,
        example: {
            fullName: 'John Doe',
            imageUrl: 'https://i.ibb.co/5WHkfvR4/profile.jpg',
            dateOfBirth: '1998-07-21',
            gender: user_schema_1.Gender.MALE,
        },
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateProfileDto),
    __metadata("design:type", CreateProfileDto)
], CreateUserDto.prototype, "profile", void 0);
//# sourceMappingURL=create-user.dto.js.map