import { CleanupResponseDto } from './dto/cleanup-response.dto';
import { MediaResponseDto } from './dto/media-response.dto';
import { MediaService } from './media.service';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    uploadFile(file: Express.Multer.File): Promise<MediaResponseDto>;
    getFileMetadata(id: string): Promise<MediaResponseDto>;
    deleteFile(id: string): Promise<void>;
    cleanupOrphans(): Promise<CleanupResponseDto>;
}
