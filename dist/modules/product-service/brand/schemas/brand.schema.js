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
exports.BrandSchema = exports.Brand = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let SocialMedia = class SocialMedia {
    facebook;
    instagram;
    twitter;
    youtube;
};
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], SocialMedia.prototype, "facebook", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], SocialMedia.prototype, "instagram", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], SocialMedia.prototype, "twitter", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], SocialMedia.prototype, "youtube", void 0);
SocialMedia = __decorate([
    (0, mongoose_1.Schema)()
], SocialMedia);
let Brand = class Brand {
    name;
    slug;
    description;
    logo;
    website;
    establishedYear;
    country;
    isActive;
    socialMedia;
    productCount;
    averageRating;
    meta;
};
exports.Brand = Brand;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Brand.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true }),
    __metadata("design:type", String)
], Brand.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Brand.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Brand.prototype, "logo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Brand.prototype, "website", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Brand.prototype, "establishedYear", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Brand.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Brand.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: SocialMedia, default: {} }),
    __metadata("design:type", SocialMedia)
], Brand.prototype, "socialMedia", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Brand.prototype, "productCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Brand.prototype, "averageRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Brand.prototype, "meta", void 0);
exports.Brand = Brand = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Brand);
exports.BrandSchema = mongoose_1.SchemaFactory.createForClass(Brand);
exports.BrandSchema.index({ name: 'text', description: 'text' });
//# sourceMappingURL=brand.schema.js.map