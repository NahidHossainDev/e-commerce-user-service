import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CmsPageStatus, CmsPageType } from '../enums/page.enum';

export type CmsPageDocument = CmsPage & Document;

@Schema({ _id: false })
export class CmsPageSeo {
  @Prop({ trim: true })
  title?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: [String], default: [] })
  keywords?: string[];
}

@Schema({
  timestamps: true,
  collection: 'cms-pages',
})
export class CmsPage {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  slug!: string;

  @Prop({ required: true, enum: CmsPageType, default: CmsPageType.CUSTOM, index: true })
  type: CmsPageType = CmsPageType.CUSTOM;

  @Prop({ required: true, enum: CmsPageStatus, default: CmsPageStatus.DRAFT, index: true })
  status: CmsPageStatus = CmsPageStatus.DRAFT;

  @Prop({ default: false, index: true })
  isHomePage: boolean = false;

  @Prop({ type: CmsPageSeo, default: () => ({}) })
  seo!: CmsPageSeo;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'CmsComponent' }], default: [] })
  componentIds: Types.ObjectId[] = [];

  @Prop({ trim: true })
  createdBy?: string;

  @Prop({ trim: true })
  updatedBy?: string;
}

export const CmsPageSchema = SchemaFactory.createForClass(CmsPage);
