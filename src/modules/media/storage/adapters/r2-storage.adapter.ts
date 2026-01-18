import {
  CopyObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  ObjectCannedACL,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable, Logger } from '@nestjs/common';
import { config } from 'src/config';
import { StorageAdapter } from '../storage.adapter.interface';

@Injectable()
export class R2StorageAdapter implements StorageAdapter {
  private readonly client: S3Client;
  private readonly logger = new Logger(R2StorageAdapter.name);

  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.r2.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.r2.accessKeyId,
        secretAccessKey: config.r2.secretAccessKey,
      },
    });
  }

  async uploadFile(
    file: Buffer,
    key: string,
    mimeType: string,
    acl: ObjectCannedACL = 'public-read',
  ): Promise<string> {
    try {
      const upload = new Upload({
        client: this.client,
        params: {
          Bucket: config.r2.bucketName,
          Key: key,
          Body: file,
          ContentType: mimeType,
          ACL: acl,
        },
      });

      await upload.done();
      return `${config.r2.publicUrl}/${key}`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to upload file to R2: ${errorMessage}`);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: config.r2.bucketName,
        Key: key,
      });

      await this.client.send(command);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to delete file from R2: ${errorMessage}`);
      throw error;
    }
  }

  async listObjects(prefix?: string): Promise<string[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: config.r2.bucketName,
        Prefix: prefix,
      });

      const response = await this.client.send(command);
      return (
        response.Contents?.map((obj) => obj.Key).filter(
          (key): key is string => !!key,
        ) || []
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to list objects from R2: ${errorMessage}`);
      throw error;
    }
  }

  async copyFile(sourceKey: string, destinationKey: string): Promise<void> {
    try {
      const command = new CopyObjectCommand({
        Bucket: config.r2.bucketName,
        CopySource: `${config.r2.bucketName}/${sourceKey}`,
        Key: destinationKey,
        ACL: 'public-read',
      });

      await this.client.send(command);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to copy file in R2: ${errorMessage}`);
      throw error;
    }
  }
}
