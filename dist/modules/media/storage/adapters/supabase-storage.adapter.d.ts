import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { StorageAdapter } from '../storage.adapter.interface';
export declare class SupabaseStorageAdapter implements StorageAdapter {
    private readonly client;
    private readonly logger;
    private readonly bucket;
    constructor();
    private checkKeyRole;
    uploadFile(file: Buffer, key: string, mimeType: string, _acl?: ObjectCannedACL): Promise<string>;
    deleteFile(key: string): Promise<void>;
    listObjects(prefix?: string): Promise<string[]>;
    copyFile(sourceKey: string, destinationKey: string): Promise<void>;
    getPublicUrl(key: string): string;
}
