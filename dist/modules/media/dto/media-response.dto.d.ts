import { MediaStatus, MediaType } from '../domain/media.types';
export declare class MediaResponseDto {
    id: string;
    url: string;
    storageKey?: string;
    status?: MediaStatus;
    ownerId?: string;
    ownerType?: string;
    type?: MediaType;
    format?: string;
    width?: number;
    height?: number;
    size?: number;
    originalName?: string;
    createdAt?: Date;
}
