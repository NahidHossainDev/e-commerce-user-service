import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CmsComponentType } from '../enums/component.enum';

export type CmsComponentDocument = CmsComponent & Document;

@Schema({ _id: false })
export class ComponentSettings {
  @Prop({ default: 'boxed' })
  container: string;

  @Prop({ default: false })
  fullWidth: boolean;

  @Prop({ trim: true })
  backgroundColor: string;

  @Prop({ trim: true })
  paddingTop: string;

  @Prop({ trim: true })
  paddingBottom: string;
}

@Schema({
  timestamps: true,
  collection: 'cms-components',
})
export class CmsComponent {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  pageId: Types.ObjectId;

  @Prop({ required: true, enum: CmsComponentType, index: true })
  componentType: CmsComponentType;

  @Prop({ required: true, index: true })
  order: number;

  @Prop({ default: true, index: true })
  isVisible: boolean;

  @Prop({ type: ComponentSettings, default: () => ({}) })
  settings: ComponentSettings;

  @Prop({ type: Object, default: {} })
  data: Record<string, any>;
}

export const CmsComponentSchema = SchemaFactory.createForClass(CmsComponent);

// Compound Index to optimize sorting components inside pages
CmsComponentSchema.index({ pageId: 1, order: 1 });
CmsComponentSchema.index({ pageId: 1, isVisible: 1, order: 1 });
