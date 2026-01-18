import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from 'src/config';
import { StorageAdapter } from '../storage.adapter.interface';

@Injectable()
export class SupabaseStorageAdapter implements StorageAdapter {
  private readonly client: SupabaseClient;
  private readonly logger = new Logger(SupabaseStorageAdapter.name);
  private readonly bucket: string;

  constructor() {
    this.client = createClient(config.supabase.url, config.supabase.key);
    this.bucket = config.supabase.bucket;
  }

  async uploadFile(
    file: Buffer,
    key: string,
    mimeType: string,
    acl?: ObjectCannedACL,
  ): Promise<string> {
    try {
      const { error } = await this.client.storage
        .from(this.bucket)
        .upload(key, file, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) throw error;

      const { data } = this.client.storage.from(this.bucket).getPublicUrl(key);

      return data.publicUrl;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to upload file to Supabase: ${errorMessage}`);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const { error } = await this.client.storage
        .from(this.bucket)
        .remove([key]);

      if (error) throw error;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to delete file from Supabase: ${errorMessage}`);
      throw error;
    }
  }

  async listObjects(prefix: string = ''): Promise<string[]> {
    try {
      // Supabase list expects a folder path. If prefix is typically "tmp/" or "images/", it works.
      // If prefix is empty, list root.
      // Note: Supabase list is not recursive by default like S3, so this might be limited.
      // However, for strict interface compliance we do our best.
      const { data, error } = await this.client.storage
        .from(this.bucket)
        .list(prefix, {
          limit: 100,
          offset: 0,
        });

      if (error) throw error;

      // Note: 'list' returns file names relative to the folder, so we prepend prefix.
      return data.map((item) => (prefix ? `${prefix}${item.name}` : item.name));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to list objects from Supabase: ${errorMessage}`,
      );
      throw error;
    }
  }

  async copyFile(sourceKey: string, destinationKey: string): Promise<void> {
    try {
      const { error } = await this.client.storage
        .from(this.bucket)
        .copy(sourceKey, destinationKey);

      if (error) throw error;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to copy file in Supabase: ${errorMessage}`);
      throw error;
    }
  }
}
