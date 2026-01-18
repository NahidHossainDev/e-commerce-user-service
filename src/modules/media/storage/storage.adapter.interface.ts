import { ObjectCannedACL } from '@aws-sdk/client-s3';

export interface StorageAdapter {
  uploadFile(
    file: Buffer,
    key: string,
    mimeType: string,
    acl?: ObjectCannedACL,
  ): Promise<string>;

  deleteFile(key: string): Promise<void>;

  listObjects(prefix?: string): Promise<string[]>;

  copyFile(sourceKey: string, destinationKey: string): Promise<void>;
}
