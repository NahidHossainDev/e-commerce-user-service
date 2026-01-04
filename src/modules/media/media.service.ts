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
import { MediaType } from './domain/media.types';
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
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.warn(
          `Optimization failed for image ${multerFile.originalname}, uploading original. Error: ${errorMessage}`,
        );
      }
    } else if (this.imageOptimizer.isVideo(mimeType)) {
      type = MediaType.VIDEO;
    } else if (this.imageOptimizer.isDocument(mimeType)) {
      type = MediaType.DOCUMENT;
    }

    const key = `${type}s/${id}.${finalFormat}`;

    try {
      const url = await this.r2Adapter.uploadFile(
        finalBuffer,
        key,
        `image/${finalFormat}`,
      );

      const media = new this.mediaModel({
        id,
        url,
        type,
        format: finalFormat,
        size: finalBuffer.length,
        width,
        height,
        originalName: file.originalname,
        mimeType: type === MediaType.IMAGE ? `image/${finalFormat}` : mimeType,
      });

      await media.save();

      return this.mapToResponseDto(media);
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

    const key = media.url.split('/').pop();
    if (key) {
      const fullKey = `${media.type}s/${key}`;
      await this.r2Adapter.deleteFile(fullKey);
    }

    await this.mediaModel.deleteOne({ id }).exec();
  }

  private mapToResponseDto(media: Media): MediaResponseDto {
    return {
      id: media.id,
      url: media.url,
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
