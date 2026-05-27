import { BadRequestException, Injectable, Type } from '@nestjs/common';
import {
  BlogGridDataDto,
  BrandSliderDataDto,
  CategoryGridDataDto,
  CustomHtmlDataDto,
  FeatureIconsDataDto,
  HeroSliderDataDto,
  ProductGridDataDto,
  PromoBannerDataDto,
  RichTextDataDto,
  TestimonialsDataDto,
  VideoSectionDataDto,
} from './dto/component-data.dto';
import { CmsComponentType } from './enums/component.enum';

const DTO_MAP: Record<CmsComponentType, Type<any>> = {
  [CmsComponentType.HERO_SLIDER]: HeroSliderDataDto,
  [CmsComponentType.FEATURE_ICONS]: FeatureIconsDataDto,
  [CmsComponentType.PRODUCT_GRID]: ProductGridDataDto,
  [CmsComponentType.CATEGORY_GRID]: CategoryGridDataDto,
  [CmsComponentType.PROMO_BANNER]: PromoBannerDataDto,
  [CmsComponentType.BRAND_SLIDER]: BrandSliderDataDto,
  [CmsComponentType.BLOG_GRID]: BlogGridDataDto,
  [CmsComponentType.VIDEO_SECTION]: VideoSectionDataDto,
  [CmsComponentType.TESTIMONIALS]: TestimonialsDataDto,
  [CmsComponentType.RICH_TEXT]: RichTextDataDto,
  [CmsComponentType.CUSTOM_HTML]: CustomHtmlDataDto,
};

@Injectable()
export class ComponentValidationService {
  validateData(
    type: CmsComponentType,
    rawData: Record<string, any>,
  ): Promise<any> {
    if (
      !rawData ||
      typeof rawData !== 'object' ||
      Object.keys(rawData).length === 0
    ) {
      throw new BadRequestException({
        message: `Validation failed for component type ${type}`,
        errors: ['Component data should not be empty'],
      });
    }

    return Promise.resolve(rawData);
  }
}
