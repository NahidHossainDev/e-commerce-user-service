export enum MediaEvent {
  UPLOADED = 'media.uploaded',
  DELETED = 'media.deleted',
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
