import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageOptimizerService } from './infrastructure/image-optimizer.service';
import { R2StorageAdapter } from './infrastructure/r2-storage.adapter';
import { Media, MediaSchema } from './infrastructure/schemas/media.schema';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
  ],
  controllers: [MediaController],
  providers: [MediaService, R2StorageAdapter, ImageOptimizerService],
  exports: [MediaService],
})
export class MediaModule {}
