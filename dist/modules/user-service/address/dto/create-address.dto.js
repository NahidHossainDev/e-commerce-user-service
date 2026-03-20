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
exports.CreateAddressDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const address_schema_1 = require("../address.schema");
class CreateAddressDto {
    userId;
    fullName;
    phoneNumber;
    type;
    street;
    city;
    state;
    postalCode;
    country;
    isDefault;
}
exports.CreateAddressDto = CreateAddressDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        example: '6741fcb913bdffb52f8f945e',
        description: 'ID of the user who owns this address',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John Doe',
        description: 'Full name of the address owner',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+8801712345678',
        description: 'Contact phone number',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsPhoneNumber)('BD'),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: address_schema_1.AddressType,
        example: address_schema_1.AddressType.HOME,
        description: 'Type of address',
    }),
    (0, class_validator_1.IsEnum)(address_schema_1.AddressType),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123 Main Street',
        description: 'Street address line',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Dhaka',
        description: 'City name',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Dhaka Division',
        description: 'State or province name',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1207',
        description: 'Postal or ZIP code',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Bangladesh',
        description: 'Country name',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Whether this is the default address',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAddressDto.prototype, "isDefault", void 0);
//# sourceMappingURL=create-address.dto.js.map