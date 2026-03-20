"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageFactory = void 0;
const config_1 = require("../../../config");
const r2_storage_adapter_1 = require("./adapters/r2-storage.adapter");
const supabase_storage_adapter_1 = require("./adapters/supabase-storage.adapter");
exports.StorageFactory = {
    provide: 'STORAGE_ADAPTER',
    useFactory: () => {
        const provider = config_1.config.storageProvider;
        if (provider === 'supabase') {
            return new supabase_storage_adapter_1.SupabaseStorageAdapter();
        }
        return new r2_storage_adapter_1.R2StorageAdapter();
    },
};
//# sourceMappingURL=storage.factory.js.map