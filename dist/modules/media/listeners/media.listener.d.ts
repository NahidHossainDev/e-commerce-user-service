import { ImageAttachedEvent, ImageDetachedEvent } from 'src/common/events/media.events';
import { MediaService } from '../media.service';
export declare class MediaListener {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    handleImageAttached(event: ImageAttachedEvent): Promise<void>;
    handleImageDetached(event: ImageDetachedEvent): Promise<void>;
}
