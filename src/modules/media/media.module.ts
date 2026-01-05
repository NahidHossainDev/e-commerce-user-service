import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminMediaController } from './admin-media.controller';
import { ImageOptimizerService } from './infrastructure/image-optimizer.service';
import { R2StorageAdapter } from './infrastructure/r2-storage.adapter';
import { Media, MediaSchema } from './infrastructure/schemas/media.schema';
import { MediaListener } from './listeners/media.listener';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
  ],
  controllers: [MediaController, AdminMediaController],
  providers: [
    MediaService,
    R2StorageAdapter,
    ImageOptimizerService,
    MediaListener,
  ],
  exports: [MediaService],
})
export class MediaModule {}
