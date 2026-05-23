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
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
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
    async validateData(type, rawData) {
        const DtoClass = DTO_MAP[type];
        if (!DtoClass) {
            throw new common_1.BadRequestException(`No validation schema registered for component type: ${type}`);
        }
        const objectInstance = (0, class_transformer_1.plainToInstance)(DtoClass, rawData || {});
        const validationErrors = await (0, class_validator_1.validate)(objectInstance, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });
        if (validationErrors.length > 0) {
            const formattedErrors = this.flattenErrors(validationErrors);
            throw new common_1.BadRequestException({
                message: `Validation failed for component type ${type}`,
                errors: formattedErrors,
            });
        }
        return objectInstance;
    }
    flattenErrors(errors) {
        const result = [];
        for (const error of errors) {
            if (error.constraints) {
                result.push(...Object.values(error.constraints));
            }
            if (error.children && error.children.length > 0) {
                result.push(...this.flattenErrors(error.children));
            }
        }
        return result;
    }
};
exports.ComponentValidationService = ComponentValidationService;
exports.ComponentValidationService = ComponentValidationService = __decorate([
    (0, common_1.Injectable)()
], ComponentValidationService);
//# sourceMappingURL=validation.service.js.map