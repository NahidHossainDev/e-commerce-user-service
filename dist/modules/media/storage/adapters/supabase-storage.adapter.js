"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SupabaseStorageAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseStorageAdapter = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("../../../../config");
let SupabaseStorageAdapter = SupabaseStorageAdapter_1 = class SupabaseStorageAdapter {
    client;
    logger = new common_1.Logger(SupabaseStorageAdapter_1.name);
    bucket;
    constructor() {
        if (!config_1.config.supabase.url || !config_1.config.supabase.key) {
            this.logger.error('Supabase configuration is missing URL or Key. Check your environment variables.');
        }
        this.client = (0, supabase_js_1.createClient)(config_1.config.supabase.url, config_1.config.supabase.key, {
            auth: {
                persistSession: false,
                detectSessionInUrl: false,
                autoRefreshToken: false,
            },
        });
        this.bucket = config_1.config.supabase.bucket;
        this.checkKeyRole(config_1.config.supabase.key);
    }
    checkKeyRole(key) {
        try {
            if (!key || !key.includes('.'))
                return;
            const parts = key.split('.');
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            const role = payload.role;
            this.logger.log(`Supabase initialized with key role: ${role}`);
            if (role !== 'service_role') {
                this.logger.warn('CRITICAL: The provided key is NOT a service_role key. ' +
                    'Supabase Storage will reject uploads unless you have public RLS policies. ' +
                    'Please use the SERVICE_ROLE_KEY to bypass RLS.');
            }
        }
        catch {
            this.logger.warn('Could not verify Supabase key JWT payload.');
        }
    }
    async uploadFile(file, key, mimeType, _acl) {
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
                    this.logger.error(`RLS Violation: The current key (${config_1.config.storageProvider} provider) does not have permission to upload to bucket "${this.bucket}". ` +
                        'Ensure you are using the SERVICE_ROLE_KEY or have configured RLS policies.');
                }
                throw error;
            }
            const { data } = this.client.storage.from(this.bucket).getPublicUrl(key);
            return data.publicUrl;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to upload file to Supabase: ${errorMessage}`);
            throw error;
        }
    }
    async deleteFile(key) {
        try {
            const { error } = await this.client.storage
                .from(this.bucket)
                .remove([key]);
            if (error)
                throw error;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to delete file from Supabase: ${errorMessage}`);
            throw error;
        }
    }
    async listObjects(prefix = '') {
        try {
            const { data, error } = await this.client.storage
                .from(this.bucket)
                .list(prefix, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });
            if (error)
                throw error;
            return (data?.map((item) => (prefix ? `${prefix}${item.name}` : item.name)) ||
                []);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to list objects from Supabase: ${errorMessage}`);
            throw error;
        }
    }
    async copyFile(sourceKey, destinationKey) {
        try {
            const { error } = await this.client.storage
                .from(this.bucket)
                .copy(sourceKey, destinationKey);
            if (error)
                throw error;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to copy file in Supabase: ${errorMessage}`);
            throw error;
        }
    }
    getPublicUrl(key) {
        const { data } = this.client.storage.from(this.bucket).getPublicUrl(key);
        return data.publicUrl;
    }
};
exports.SupabaseStorageAdapter = SupabaseStorageAdapter;
exports.SupabaseStorageAdapter = SupabaseStorageAdapter = SupabaseStorageAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SupabaseStorageAdapter);
//# sourceMappingURL=supabase-storage.adapter.js.map