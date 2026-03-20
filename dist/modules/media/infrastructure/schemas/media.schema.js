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
exports.MediaSchema = exports.Media = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const media_types_1 = require("../../domain/media.types");
let Media = class Media extends mongoose_2.Document {
    url;
    type;
    format;
    size;
    width;
    height;
    originalName;
    mimeType;
    createdAt;
};
exports.Media = Media;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Media.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Media.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Media.prototype, "storageKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: media_types_1.MediaStatus, default: media_types_1.MediaStatus.TEMP }),
    __metadata("design:type", String)
], Media.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Media.prototype, "ownerId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Media.prototype, "ownerType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: media_types_1.MediaType }),
    __metadata("design:type", String)
], Media.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Media.prototype, "format", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Media.prototype, "size", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Media.prototype, "width", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Media.prototype, "height", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Media.prototype, "originalName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Media.prototype, "mimeType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Media.prototype, "createdAt", void 0);
exports.Media = Media = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'media' })
], Media);
exports.MediaSchema = mongoose_1.SchemaFactory.createForClass(Media);
//# sourceMappingURL=media.schema.js.map