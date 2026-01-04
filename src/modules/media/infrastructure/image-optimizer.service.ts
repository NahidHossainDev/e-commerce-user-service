import { Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageOptimizerService {
  private readonly logger = new Logger(ImageOptimizerService.name);

  async convertToWebP(
    file: Buffer,
  ): Promise<{ data: Buffer; info: sharp.OutputInfo }> {
    try {
      return await sharp(file)
        .webp({ quality: 80 })
        .toBuffer({ resolveWithObject: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to optimize image: ${errorMessage}`);
      throw error;
    }
  }

  async getMetadata(file: Buffer): Promise<sharp.Metadata> {
    try {
      return await sharp(file).metadata();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get image metadata: ${errorMessage}`);
      throw error;
    }
  }

  isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  isVideo(mimeType: string): boolean {
    return mimeType.startsWith('video/');
  }

  isDocument(mimeType: string): boolean {
    const documentMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];
    return documentMimeTypes.includes(mimeType);
  }
}
