import { Prop, Schema } from '@nestjs/mongoose';
import { AppCurrency, DEFAULT_CURRENCY } from '../constants';

@Schema({ _id: false })
export class Price {
  @Prop({ required: true, min: 0, index: true })
  basePrice: number;

  @Prop({ min: 0 })
  discountPrice: number;

  @Prop({ min: 0, max: 100 })
  discountRate: number;

  @Prop({ required: true, enum: AppCurrency, default: DEFAULT_CURRENCY })
  currency: string;
}
