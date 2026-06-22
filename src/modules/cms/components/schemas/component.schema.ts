import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiExtraModels, ApiProperty, ApiPropertyOptional, getSchemaPath } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { CmsComponentType } from '../enums/component.enum';
import {
  BlogGridDataDto,
  BrandGridDataDto,
  CategoryGridDataDto,
  CtaBannerDataDto,
  CustomHtmlDataDto,
  FeatureIconsDataDto,
  HeroSliderDataDto,
  ImageGridDataDto,
  InfoBoxDataDto,
  ProductSectionDataDto,
  PromoBannerDataDto,
  RichTextDataDto,
  SectionHeaderDataDto,
  TestimonialsDataDto,
  VideoSectionDataDto,
} from '../dto/component-data.dto';

export type CmsComponentDocument = CmsComponent & Document;

@Schema({ _id: false })
export class ComponentSettings {
  @ApiProperty({ description: 'Layout container type', default: 'boxed' })
  @Prop({ default: 'boxed' })
  container: string;

  @ApiProperty({ description: 'Full width visual stretch flag', default: false })
  @Prop({ default: false })
  fullWidth: boolean;

  @ApiPropertyOptional({ description: 'Background color override hex' })
  @Prop({ trim: true })
  backgroundColor: string;

  @ApiPropertyOptional({ description: 'Top padding in CSS units' })
  @Prop({ trim: true })
  paddingTop: string;

  @ApiPropertyOptional({ description: 'Bottom padding in CSS units' })
  @Prop({ trim: true })
  paddingBottom: string;
}

@ApiExtraModels(
  HeroSliderDataDto,
  FeatureIconsDataDto,
  ProductSectionDataDto,
  CategoryGridDataDto,
  PromoBannerDataDto,
  ImageGridDataDto,
  BlogGridDataDto,
  VideoSectionDataDto,
  TestimonialsDataDto,
  RichTextDataDto,
  CustomHtmlDataDto,
  SectionHeaderDataDto,
  CtaBannerDataDto,
  InfoBoxDataDto,
  BrandGridDataDto,
)
@Schema({
  timestamps: true,
  collection: 'cms-components',
})
export class CmsComponent {
  @ApiProperty({ description: 'Database primary key identifier string' })
  _id!: string;

  @ApiProperty({ description: 'Page reference ID mapping' })
  @Prop({ type: Types.ObjectId, required: true, index: true })
  pageId!: Types.ObjectId;

  @ApiProperty({ enum: CmsComponentType, description: 'Component display style type' })
  @Prop({ required: true, enum: CmsComponentType, index: true })
  componentType!: CmsComponentType;

  @ApiProperty({ description: 'Display placement order index' })
  @Prop({ required: true, index: true })
  order!: number;

  @ApiProperty({ description: 'Visual visibility display toggle status flag' })
  @Prop({ default: true, index: true })
  isVisible!: boolean;

  @ApiProperty({ type: ComponentSettings, description: 'Visual display layout settings parameters' })
  @Prop({ type: ComponentSettings, default: () => ({}) })
  settings!: ComponentSettings;

  @ApiProperty({
    description: 'Dynamic component properties details configuration',
    oneOf: [
      { $ref: getSchemaPath(HeroSliderDataDto) },
      { $ref: getSchemaPath(FeatureIconsDataDto) },
      { $ref: getSchemaPath(ProductSectionDataDto) },
      { $ref: getSchemaPath(CategoryGridDataDto) },
      { $ref: getSchemaPath(PromoBannerDataDto) },
      { $ref: getSchemaPath(ImageGridDataDto) },
      { $ref: getSchemaPath(BlogGridDataDto) },
      { $ref: getSchemaPath(VideoSectionDataDto) },
      { $ref: getSchemaPath(TestimonialsDataDto) },
      { $ref: getSchemaPath(RichTextDataDto) },
      { $ref: getSchemaPath(CustomHtmlDataDto) },
      { $ref: getSchemaPath(SectionHeaderDataDto) },
      { $ref: getSchemaPath(CtaBannerDataDto) },
      { $ref: getSchemaPath(InfoBoxDataDto) },
      { $ref: getSchemaPath(BrandGridDataDto) },
    ],
  })
  @Prop({ type: Object, default: {} })
  data!: Record<string, any>;

  @ApiProperty({ description: 'Database entry creation timestamp string' })
  createdAt!: string;

  @ApiProperty({ description: 'Database entry update timestamp string' })
  updatedAt!: string;
}

export const CmsComponentSchema = SchemaFactory.createForClass(CmsComponent);

// Compound Index to optimize sorting components inside pages
CmsComponentSchema.index({ pageId: 1, order: 1 });
CmsComponentSchema.index({ pageId: 1, isVisible: 1, order: 1 });
