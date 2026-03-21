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
exports.AddressMessageResponseDto = exports.AddressResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const address_schema_1 = require("../address.schema");
class AddressResponseDto {
    _id;
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
    createdAt;
    updatedAt;
}
exports.AddressResponseDto = AddressResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e1' }),
    __metadata("design:type", Object)
], AddressResponseDto.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d012' }),
    __metadata("design:type", Object)
], AddressResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+8801700000000' }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: address_schema_1.AddressType, example: address_schema_1.AddressType.HOME }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Street' }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dhaka' }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dhaka' }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1212' }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bangladesh' }),
    __metadata("design:type", String)
], AddressResponseDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], AddressResponseDto.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], AddressResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], AddressResponseDto.prototype, "updatedAt", void 0);
class AddressMessageResponseDto {
    message;
}
exports.AddressMessageResponseDto = AddressMessageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Address deleted successfully' }),
    __metadata("design:type", String)
], AddressMessageResponseDto.prototype, "message", void 0);
//# sourceMappingURL=address-response.dto.js.map