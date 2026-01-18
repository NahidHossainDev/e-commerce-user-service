import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminMediaController } from './admin-media.controller';
import { ImageOptimizerService } from './infrastructure/image-optimizer.service';
import { Media, MediaSchema } from './infrastructure/schemas/media.schema';
import { MediaListener } from './listeners/media.listener';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { StorageFactory } from './storage/storage.factory';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
  ],
  controllers: [MediaController, AdminMediaController],
  providers: [
    MediaService,
    StorageFactory,
    ImageOptimizerService,
    MediaListener,
  ],
  exports: [MediaService],
})
export class MediaModule {}
