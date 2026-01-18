import { Provider } from '@nestjs/common';
import { config } from '../../../config';
import { R2StorageAdapter } from './adapters/r2-storage.adapter';
import { SupabaseStorageAdapter } from './adapters/supabase-storage.adapter';

export const StorageFactory: Provider = {
  provide: 'STORAGE_ADAPTER',
  useFactory: () => {
    const provider = config.storageProvider;

    if (provider === 'supabase') {
      return new SupabaseStorageAdapter();
    }

    return new R2StorageAdapter();
  },
};
