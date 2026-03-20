import { TempCleanupResponseDto } from './dto/temp-cleanup-response.dto';
import { MediaService } from './media.service';
export declare class AdminMediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    cleanupTempFiles(): Promise<TempCleanupResponseDto>;
}
