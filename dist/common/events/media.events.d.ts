export declare enum MediaEvent {
    UPLOADED = "media.uploaded",
    DELETED = "media.deleted",
    IMAGE_ATTACHED = "image.attached",
    IMAGE_DETACHED = "image.detached"
}
export declare class MediaUploadedEvent {
    readonly id: string;
    readonly url: string;
    readonly type: string;
    constructor(id: string, url: string, type: string);
}
export declare class MediaDeletedEvent {
    readonly id: string;
    constructor(id: string);
}
export declare class ImageAttachedEvent {
    readonly mediaId: string;
    readonly ownerId: string;
    readonly ownerType: string;
    constructor(mediaId: string, ownerId: string, ownerType: string);
}
export declare class ImageDetachedEvent {
    readonly mediaId: string;
    constructor(mediaId: string);
}
