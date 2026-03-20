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
exports.MediaResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const media_types_1 = require("../domain/media.types");
class MediaResponseDto {
    id;
    url;
    storageKey;
    status;
    ownerId;
    ownerType;
    type;
    format;
    width;
    height;
    size;
    originalName;
    createdAt;
}
exports.MediaResponseDto = MediaResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "storageKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: media_types_1.MediaStatus, required: false }),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "ownerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: media_types_1.MediaType, required: false }),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], MediaResponseDto.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], MediaResponseDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Number)
], MediaResponseDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], MediaResponseDto.prototype, "originalName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", Date)
], MediaResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=media-response.dto.js.map