import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { StorageAdapter } from '../storage.adapter.interface';
export declare class R2StorageAdapter implements StorageAdapter {
    private readonly client;
    private readonly logger;
    constructor();
    uploadFile(file: Buffer, key: string, mimeType: string, acl?: ObjectCannedACL): Promise<string>;
    deleteFile(key: string): Promise<void>;
    listObjects(prefix?: string): Promise<string[]>;
    copyFile(sourceKey: string, destinationKey: string): Promise<void>;
    getPublicUrl(key: string): string;
}
