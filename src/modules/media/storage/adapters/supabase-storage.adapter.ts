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
    if (!config.supabase.url || !config.supabase.key) {
      this.logger.error(
        'Supabase configuration is missing URL or Key. Check your environment variables.',
      );
    }

    this.client = createClient(config.supabase.url, config.supabase.key, {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
      },
    });
    this.bucket = config.supabase.bucket;

    this.checkKeyRole(config.supabase.key);
  }

  private checkKeyRole(key: string) {
    try {
      if (!key || !key.includes('.')) return;
      const parts = key.split('.');
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const role = payload.role as string;

      this.logger.log(`Supabase initialized with key role: ${role}`);

      if (role !== 'service_role') {
        this.logger.warn(
          'CRITICAL: The provided key is NOT a service_role key. ' +
            'Supabase Storage will reject uploads unless you have public RLS policies. ' +
            'Please use the SERVICE_ROLE_KEY to bypass RLS.',
        );
      }
    } catch {
      this.logger.warn('Could not verify Supabase key JWT payload.');
    }
  }

  async uploadFile(
    file: Buffer,
    key: string,
    mimeType: string,
    _acl?: ObjectCannedACL,
  ): Promise<string> {
    try {
      this.logger.debug(`Uploading to Supabase: ${key} (${mimeType})`);

      const { error } = await this.client.storage
        .from(this.bucket)
        .upload(key, file, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        if (error.message?.includes('row-level security')) {
          this.logger.error(
            `RLS Violation: The current key (${config.storageProvider} provider) does not have permission to upload to bucket "${this.bucket}". ` +
              'Ensure you are using the SERVICE_ROLE_KEY or have configured RLS policies.',
          );
        }
        throw error;
      }

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
      const { data, error } = await this.client.storage
        .from(this.bucket)
        .list(prefix, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) throw error;

      return (
        data?.map((item) => (prefix ? `${prefix}${item.name}` : item.name)) ||
        []
      );
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

  getPublicUrl(key: string): string {
    const { data } = this.client.storage.from(this.bucket).getPublicUrl(key);
    return data.publicUrl;
  }
}
