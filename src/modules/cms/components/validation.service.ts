import { BadRequestException, Injectable, Type } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
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
  /**
   * Safely transforms and validates the dynamic JSON payload of a component
   * based on its declared componentType.
   */
  async validateData(type: CmsComponentType, rawData: Record<string, any>): Promise<any> {
    const DtoClass = DTO_MAP[type];
    if (!DtoClass) {
      throw new BadRequestException(`No validation schema registered for component type: ${type}`);
    }

    const objectInstance = plainToInstance(DtoClass, rawData || {});
    const validationErrors = await validate(objectInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (validationErrors.length > 0) {
      const formattedErrors = this.flattenErrors(validationErrors);
      throw new BadRequestException({
        message: `Validation failed for component type ${type}`,
        errors: formattedErrors,
      });
    }

    return objectInstance;
  }

  private flattenErrors(errors: ValidationError[]): string[] {
    const result: string[] = [];
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
}
