import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { ProductMedia, ProductMediaSchema } from './schemas/media.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductMedia.name, schema: ProductMediaSchema },
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
