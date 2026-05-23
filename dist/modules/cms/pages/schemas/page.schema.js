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
exports.CmsPageSchema = exports.CmsPage = exports.CmsPageSeo = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const page_enum_1 = require("../enums/page.enum");
let CmsPageSeo = class CmsPageSeo {
    title;
    description;
    keywords;
};
exports.CmsPageSeo = CmsPageSeo;
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], CmsPageSeo.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], CmsPageSeo.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], CmsPageSeo.prototype, "keywords", void 0);
exports.CmsPageSeo = CmsPageSeo = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], CmsPageSeo);
let CmsPage = class CmsPage {
    title;
    slug;
    type = page_enum_1.CmsPageType.CUSTOM;
    status = page_enum_1.CmsPageStatus.DRAFT;
    isHomePage = false;
    seo;
    componentIds = [];
    createdBy;
    updatedBy;
};
exports.CmsPage = CmsPage;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], CmsPage.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true, trim: true, index: true }),
    __metadata("design:type", String)
], CmsPage.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: page_enum_1.CmsPageType, default: page_enum_1.CmsPageType.CUSTOM, index: true }),
    __metadata("design:type", String)
], CmsPage.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: page_enum_1.CmsPageStatus, default: page_enum_1.CmsPageStatus.DRAFT, index: true }),
    __metadata("design:type", String)
], CmsPage.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], CmsPage.prototype, "isHomePage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: CmsPageSeo, default: () => ({}) }),
    __metadata("design:type", CmsPageSeo)
], CmsPage.prototype, "seo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'CmsComponent' }], default: [] }),
    __metadata("design:type", Array)
], CmsPage.prototype, "componentIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], CmsPage.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], CmsPage.prototype, "updatedBy", void 0);
exports.CmsPage = CmsPage = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'cms-pages',
    })
], CmsPage);
exports.CmsPageSchema = mongoose_1.SchemaFactory.createForClass(CmsPage);
//# sourceMappingURL=page.schema.js.map