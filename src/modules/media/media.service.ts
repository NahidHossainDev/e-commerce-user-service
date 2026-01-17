import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as path from 'path';
import { Stream } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import {
  ImageAttachedEvent,
  ImageDetachedEvent,
} from '../../common/events/media.events';
import { config } from '../../config';
import { MediaStatus, MediaType } from './domain/media.types';
import { CleanupResponseDto } from './dto/cleanup-response.dto';
import { MediaResponseDto } from './dto/media-response.dto';
import { ImageOptimizerService } from './infrastructure/image-optimizer.service';
import { R2StorageAdapter } from './infrastructure/r2-storage.adapter';
import { Media } from './infrastructure/schemas/media.schema';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: Stream;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<Media>,
    private readonly r2Adapter: R2StorageAdapter,
    private readonly imageOptimizer: ImageOptimizerService,
  ) {}

  async uploadFile(file: any): Promise<MediaResponseDto> {
    const multerFile = file as MulterFile;

    // 1. Validate
    if (multerFile.size > config.media.maxFileSize) {
      throw new BadRequestException(
        `File too large. Max size is ${
          config.media.maxFileSize / 1024 / 1024
        }MB`,
      );
    }
    if (!config.media.allowedMimeTypes.includes(multerFile.mimetype)) {
      throw new BadRequestException(
        `Invalid file type: ${multerFile.mimetype}`,
      );
    }

    const id = uuidv4();
    const originalExtension = path
      .extname(multerFile.originalname)
      .toLowerCase();
    const mimeType = multerFile.mimetype;

    let type: MediaType = MediaType.OTHER;
    let finalBuffer = multerFile.buffer;
    let finalFormat = originalExtension.replace('.', '');
    let width: number | undefined;
    let height: number | undefined;
    let finalMimeType = mimeType;

    if (this.imageOptimizer.isImage(mimeType)) {
      type = MediaType.IMAGE;
      try {
        const { data, info } = await this.imageOptimizer.convertToWebP(
          multerFile.buffer,
        );
        finalBuffer = data;
        finalFormat = 'webp';
        width = info.width;
        height = info.height;
        finalMimeType = 'image/webp';
      } catch {
        this.logger.warn(
          `Optimization failed for image ${multerFile.originalname}, using original.`,
        );
      }
    } else if (this.imageOptimizer.isVideo(mimeType)) {
      type = MediaType.VIDEO;
    } else if (this.imageOptimizer.isDocument(mimeType)) {
      type = MediaType.DOCUMENT;
    }

    const storageKey = `tmp/${type}s/${id}.${finalFormat}`;

    try {
      // 2. Upload to R2
      const url = await this.r2Adapter.uploadFile(
        finalBuffer,
        storageKey,
        finalMimeType,
      );

      // 3. Save to DB
      const media = new this.mediaModel({
        id,
        url,
        storageKey,
        status: MediaStatus.TEMP,
        ownerId: null,
        ownerType: null,
        type,
        format: finalFormat,
        size: finalBuffer.length,
        width,
        height,
        originalName: multerFile.originalname,
        mimeType: finalMimeType,
      });

      try {
        await media.save();
      } catch (dbError) {
        // 4. Cleanup R2 if DB save fails
        await this.r2Adapter.deleteFile(storageKey);
        throw dbError;
      }

      // 5. Return minimal response (id + url only)
      return { id: media.id as string, url: media.url };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to process upload: ${errorMessage}`);
      throw new BadRequestException(`File upload failed: ${errorMessage}`);
    }
  }

  async getFileMetadata(id: string): Promise<MediaResponseDto> {
    const media = await this.mediaModel.findOne({ id }).exec();
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    return this.mapToResponseDto(media);
  }

  async deleteFile(id: string): Promise<void> {
    const media = await this.mediaModel.findOne({ id }).exec();
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    await this.r2Adapter.deleteFile(media.storageKey);
    await this.mediaModel.deleteOne({ id }).exec();
  }

  async cleanupOrphanFiles(): Promise<CleanupResponseDto> {
    try {
      // List all files from R2
      const allR2Keys = await this.r2Adapter.listObjects();

      // Get all file URLs from DB
      const allDbMedia = await this.mediaModel
        .find({}, { storageKey: 1 })
        .exec();
      const dbKeys = new Set(allDbMedia.map((m) => m.storageKey));

      // Find orphans (Keys in R2 but NOT in DB)
      const orphanKeys = allR2Keys.filter((key) => !dbKeys.has(key));

      // Delete orphans
      if (orphanKeys.length > 0) {
        await Promise.all(
          orphanKeys.map((key) => this.r2Adapter.deleteFile(key)),
        );
      }

      return {
        deletedCount: orphanKeys.length,
        deletedKeys: orphanKeys,
        message:
          orphanKeys.length > 0
            ? `Successfully deleted ${orphanKeys.length} orphan files.`
            : 'No orphan files found.',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Orphan cleanup failed: ${errorMessage}`);
      throw new BadRequestException(`Cleanup failed: ${errorMessage}`);
    }
  }

  async cleanupTempFiles(): Promise<{
    deletedCount: number;
    deletedIds: string[];
  }> {
    try {
      const expirationHours = config.media.tempFileExpirationHours || 24;
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() - expirationHours);

      // Find TEMP media older than X hours that have 'tmp/' storageKey
      const tempMedia = await this.mediaModel
        .find({
          status: MediaStatus.TEMP,
          createdAt: { $lt: expirationDate },
          storageKey: { $regex: /^tmp\// },
        })
        .exec();

      if (tempMedia.length === 0) {
        return { deletedCount: 0, deletedIds: [] };
      }

      const deletedIds: string[] = [];

      for (const media of tempMedia) {
        try {
          // Delete from R2
          const m = media as Media;
          const storageKey = m.storageKey;
          await this.r2Adapter.deleteFile(storageKey);
          deletedIds.push(m.id);
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : 'Unknown error';
          this.logger.error(
            `Failed to delete R2 file for media ID ${media.id}: ${errMsg}`,
          );
        }
      }

      // Bulk remove from DB
      if (deletedIds.length > 0) {
        await this.mediaModel.deleteMany({ id: { $in: deletedIds } }).exec();
      }

      this.logger.log(
        `Cleaned up ${deletedIds.length} expired temporary media files.`,
      );

      return {
        deletedCount: deletedIds.length,
        deletedIds,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Temp media cleanup failed: ${errorMessage}`);
      throw new BadRequestException(`Temp cleanup failed: ${errorMessage}`);
    }
  }

  async attachImage(event: ImageAttachedEvent) {
    try {
      const media = await this.mediaModel.findOne({ id: event.mediaId }).exec();
      if (!media || media.status === MediaStatus.ACTIVE) return;

      const oldKey = media.storageKey;
      if (!oldKey.startsWith('tmp/')) return;

      const newKey = oldKey.replace('tmp/', '');

      // Copy in R2
      await this.r2Adapter.copyFile(oldKey, newKey);
      // Delete old from R2
      await this.r2Adapter.deleteFile(oldKey);

      // Update DB
      media.status = MediaStatus.ACTIVE;
      media.ownerId = event.ownerId;
      media.ownerType = event.ownerType;
      media.storageKey = newKey;
      media.url = `${config.r2.publicUrl}/${newKey}`;

      await media.save();
      this.logger.log(
        `Media ${media.id} attached to ${event.ownerType}:${event.ownerId}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to handle image attachment: ${errorMessage}`);
    }
  }

  async detachImage(event: ImageDetachedEvent) {
    try {
      const media = await this.mediaModel.findOne({ id: event.mediaId }).exec();
      if (!media || media.status === MediaStatus.TEMP) return;

      media.status = MediaStatus.TEMP;
      media.ownerId = undefined;
      media.ownerType = undefined;

      await media.save();
      this.logger.log(`Media ${media.id} detached`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to handle image detachment: ${errorMessage}`);
    }
  }

  private mapToResponseDto(media: Media): MediaResponseDto {
    return {
      id: media.id,
      url: media.url,
      storageKey: media.storageKey,
      status: media.status,
      ownerId: media.ownerId,
      ownerType: media.ownerType,
      type: media.type,
      format: media.format,
      width: media.width,
      height: media.height,
      size: media.size,
      originalName: media.originalName,
      createdAt: media.createdAt,
    };
  }
}
