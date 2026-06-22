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
exports.CmsComponentSchema = exports.CmsComponent = exports.ComponentSettings = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
const component_enum_1 = require("../enums/component.enum");
const component_data_dto_1 = require("../dto/component-data.dto");
let ComponentSettings = class ComponentSettings {
    container;
    fullWidth;
    backgroundColor;
    paddingTop;
    paddingBottom;
};
exports.ComponentSettings = ComponentSettings;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Layout container type', default: 'boxed' }),
    (0, mongoose_1.Prop)({ default: 'boxed' }),
    __metadata("design:type", String)
], ComponentSettings.prototype, "container", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full width visual stretch flag', default: false }),
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ComponentSettings.prototype, "fullWidth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Background color override hex' }),
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], ComponentSettings.prototype, "backgroundColor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Top padding in CSS units' }),
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], ComponentSettings.prototype, "paddingTop", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Bottom padding in CSS units' }),
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], ComponentSettings.prototype, "paddingBottom", void 0);
exports.ComponentSettings = ComponentSettings = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ComponentSettings);
let CmsComponent = class CmsComponent {
    _id;
    pageId;
    componentType;
    order;
    isVisible;
    settings;
    data;
    createdAt;
    updatedAt;
};
exports.CmsComponent = CmsComponent;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Database primary key identifier string' }),
    __metadata("design:type", String)
], CmsComponent.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Page reference ID mapping' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CmsComponent.prototype, "pageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: component_enum_1.CmsComponentType, description: 'Component display style type' }),
    (0, mongoose_1.Prop)({ required: true, enum: component_enum_1.CmsComponentType, index: true }),
    __metadata("design:type", String)
], CmsComponent.prototype, "componentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Display placement order index' }),
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], CmsComponent.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visual visibility display toggle status flag' }),
    (0, mongoose_1.Prop)({ default: true, index: true }),
    __metadata("design:type", Boolean)
], CmsComponent.prototype, "isVisible", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ComponentSettings, description: 'Visual display layout settings parameters' }),
    (0, mongoose_1.Prop)({ type: ComponentSettings, default: () => ({}) }),
    __metadata("design:type", ComponentSettings)
], CmsComponent.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dynamic component properties details configuration',
        oneOf: [
            { $ref: (0, swagger_1.getSchemaPath)(component_data_dto_1.HeroSliderDataDto) },
            { $ref: (0, swagger_1.getSchemaPath)(component_data_dto_1.FeatureIconsDataDto) },
            { $ref: (0, swagger_1.getSchemaPath)(component_data_dto_1.ProductSectionDataDto) },
            { $ref: (0, swagger_1.getSchemaPath)(component_data_dto_1.CategoryGridDataDto) },
            { $ref: (0, swagger_1.getSchemaPath)(component_data_dto_1.PromoBannerDataDto) },
            { $ref: (0, swagger_1.getSchemaPath)(component_data_dto_1.ImageGridDataDto) },
            { $ref: (0, swagger_1.getSchemaPath)(component_data_dto_1.BlogGridDataDto) },
            { $ref: (0, swagger_1.getSchemaPath)(component_data_dto_1.VideoSectionDataDto) },
            { $ref: (0, swagger_1.getSchemaPath)(component_data_dto_1.TestimonialsDataDto) },
            { $ref: (0, swagger_1.getSchemaPath)(component_data_dto_1.RichTextDataDto) },
            { $ref: (0, swagger_1.getSchemaPath)(component_data_dto_1.CustomHtmlDataDto) },
            { $ref: (0, swagger_1.getSchemaPath)(component_data_dto_1.SectionHeaderDataDto) },
            { $ref: (0, swagger_1.getSchemaPath)(component_data_dto_1.CtaBannerDataDto) },
            { $ref: (0, swagger_1.getSchemaPath)(component_data_dto_1.InfoBoxDataDto) },
            { $ref: (0, swagger_1.getSchemaPath)(component_data_dto_1.BrandGridDataDto) },
        ],
    }),
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], CmsComponent.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Database entry creation timestamp string' }),
    __metadata("design:type", String)
], CmsComponent.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Database entry update timestamp string' }),
    __metadata("design:type", String)
], CmsComponent.prototype, "updatedAt", void 0);
exports.CmsComponent = CmsComponent = __decorate([
    (0, swagger_1.ApiExtraModels)(component_data_dto_1.HeroSliderDataDto, component_data_dto_1.FeatureIconsDataDto, component_data_dto_1.ProductSectionDataDto, component_data_dto_1.CategoryGridDataDto, component_data_dto_1.PromoBannerDataDto, component_data_dto_1.ImageGridDataDto, component_data_dto_1.BlogGridDataDto, component_data_dto_1.VideoSectionDataDto, component_data_dto_1.TestimonialsDataDto, component_data_dto_1.RichTextDataDto, component_data_dto_1.CustomHtmlDataDto, component_data_dto_1.SectionHeaderDataDto, component_data_dto_1.CtaBannerDataDto, component_data_dto_1.InfoBoxDataDto, component_data_dto_1.BrandGridDataDto),
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'cms-components',
    })
], CmsComponent);
exports.CmsComponentSchema = mongoose_1.SchemaFactory.createForClass(CmsComponent);
exports.CmsComponentSchema.index({ pageId: 1, order: 1 });
exports.CmsComponentSchema.index({ pageId: 1, isVisible: 1, order: 1 });
//# sourceMappingURL=component.schema.js.map