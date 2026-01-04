export enum MediaEvent {
  UPLOADED = 'media.uploaded',
  DELETED = 'media.deleted',
  IMAGE_ATTACHED = 'image.attached',
  IMAGE_DETACHED = 'image.detached',
}

export class MediaUploadedEvent {
  constructor(
    public readonly id: string,
    public readonly url: string,
    public readonly type: string,
  ) {}
}

export class MediaDeletedEvent {
  constructor(public readonly id: string) {}
}

export class ImageAttachedEvent {
  constructor(
    public readonly mediaId: string,
    public readonly ownerId: string,
    public readonly ownerType: string,
  ) {}
}

export class ImageDetachedEvent {
  constructor(public readonly mediaId: string) {}
}
