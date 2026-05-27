"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentValidationService = void 0;
const common_1 = require("@nestjs/common");
const component_data_dto_1 = require("./dto/component-data.dto");
const component_enum_1 = require("./enums/component.enum");
const DTO_MAP = {
    [component_enum_1.CmsComponentType.HERO_SLIDER]: component_data_dto_1.HeroSliderDataDto,
    [component_enum_1.CmsComponentType.FEATURE_ICONS]: component_data_dto_1.FeatureIconsDataDto,
    [component_enum_1.CmsComponentType.PRODUCT_GRID]: component_data_dto_1.ProductGridDataDto,
    [component_enum_1.CmsComponentType.CATEGORY_GRID]: component_data_dto_1.CategoryGridDataDto,
    [component_enum_1.CmsComponentType.PROMO_BANNER]: component_data_dto_1.PromoBannerDataDto,
    [component_enum_1.CmsComponentType.BRAND_SLIDER]: component_data_dto_1.BrandSliderDataDto,
    [component_enum_1.CmsComponentType.BLOG_GRID]: component_data_dto_1.BlogGridDataDto,
    [component_enum_1.CmsComponentType.VIDEO_SECTION]: component_data_dto_1.VideoSectionDataDto,
    [component_enum_1.CmsComponentType.TESTIMONIALS]: component_data_dto_1.TestimonialsDataDto,
    [component_enum_1.CmsComponentType.RICH_TEXT]: component_data_dto_1.RichTextDataDto,
    [component_enum_1.CmsComponentType.CUSTOM_HTML]: component_data_dto_1.CustomHtmlDataDto,
};
let ComponentValidationService = class ComponentValidationService {
    validateData(type, rawData) {
        if (!rawData ||
            typeof rawData !== 'object' ||
            Object.keys(rawData).length === 0) {
            throw new common_1.BadRequestException({
                message: `Validation failed for component type ${type}`,
                errors: ['Component data should not be empty'],
            });
        }
        return Promise.resolve(rawData);
    }
};
exports.ComponentValidationService = ComponentValidationService;
exports.ComponentValidationService = ComponentValidationService = __decorate([
    (0, common_1.Injectable)()
], ComponentValidationService);
//# sourceMappingURL=validation.service.js.map