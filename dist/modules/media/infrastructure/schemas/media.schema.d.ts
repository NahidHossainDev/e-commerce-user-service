import { Document } from 'mongoose';
import { MediaStatus, MediaType } from '../../domain/media.types';
export declare class Media extends Document {
    id: string;
    url: string;
    storageKey: string;
    status: MediaStatus;
    ownerId?: string;
    ownerType?: string;
    type: MediaType;
    format: string;
    size: number;
    width?: number;
    height?: number;
    originalName: string;
    mimeType: string;
    createdAt: Date;
}
export declare const MediaSchema: import("mongoose").Schema<Media, import("mongoose").Model<Media, any, any, any, Document<unknown, any, Media, any, {}> & Media & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Media, Document<unknown, {}, import("mongoose").FlatRecord<Media>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Media> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
