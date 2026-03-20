import { Model } from 'mongoose';
import { ImageAttachedEvent, ImageDetachedEvent } from '../../common/events/media.events';
import { CleanupResponseDto } from './dto/cleanup-response.dto';
import { MediaResponseDto } from './dto/media-response.dto';
import { ImageOptimizerService } from './infrastructure/image-optimizer.service';
import { Media } from './infrastructure/schemas/media.schema';
import { StorageAdapter } from './storage/storage.adapter.interface';
export declare class MediaService {
    private readonly mediaModel;
    private readonly storageAdapter;
    private readonly imageOptimizer;
    private readonly logger;
    constructor(mediaModel: Model<Media>, storageAdapter: StorageAdapter, imageOptimizer: ImageOptimizerService);
    uploadFile(file: Express.Multer.File): Promise<MediaResponseDto>;
    getFileMetadata(id: string): Promise<MediaResponseDto>;
    deleteFile(id: string): Promise<void>;
    cleanupOrphanFiles(): Promise<CleanupResponseDto>;
    cleanupTempFiles(): Promise<{
        deletedCount: number;
        deletedIds: string[];
    }>;
    attachImage(event: ImageAttachedEvent): Promise<void>;
    detachImage(event: ImageDetachedEvent): Promise<void>;
    private mapToResponseDto;
}
