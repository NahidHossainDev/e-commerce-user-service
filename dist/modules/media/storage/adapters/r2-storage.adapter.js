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
var R2StorageAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2StorageAdapter = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const common_1 = require("@nestjs/common");
const config_1 = require("../../../../config");
let R2StorageAdapter = R2StorageAdapter_1 = class R2StorageAdapter {
    client;
    logger = new common_1.Logger(R2StorageAdapter_1.name);
    constructor() {
        this.client = new client_s3_1.S3Client({
            region: 'auto',
            endpoint: `https://${config_1.config.r2.accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: config_1.config.r2.accessKeyId,
                secretAccessKey: config_1.config.r2.secretAccessKey,
            },
        });
    }
    async uploadFile(file, key, mimeType, acl = 'public-read') {
        try {
            const upload = new lib_storage_1.Upload({
                client: this.client,
                params: {
                    Bucket: config_1.config.r2.bucketName,
                    Key: key,
                    Body: file,
                    ContentType: mimeType,
                    ACL: acl,
                },
            });
            await upload.done();
            return `${config_1.config.r2.publicUrl}/${key}`;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to upload file to R2: ${errorMessage}`);
            throw error;
        }
    }
    async deleteFile(key) {
        try {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: config_1.config.r2.bucketName,
                Key: key,
            });
            await this.client.send(command);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to delete file from R2: ${errorMessage}`);
            throw error;
        }
    }
    async listObjects(prefix) {
        try {
            const command = new client_s3_1.ListObjectsV2Command({
                Bucket: config_1.config.r2.bucketName,
                Prefix: prefix,
            });
            const response = await this.client.send(command);
            return (response.Contents?.map((obj) => obj.Key).filter((key) => !!key) || []);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to list objects from R2: ${errorMessage}`);
            throw error;
        }
    }
    async copyFile(sourceKey, destinationKey) {
        try {
            const command = new client_s3_1.CopyObjectCommand({
                Bucket: config_1.config.r2.bucketName,
                CopySource: `${config_1.config.r2.bucketName}/${sourceKey}`,
                Key: destinationKey,
                ACL: 'public-read',
            });
            await this.client.send(command);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to copy file in R2: ${errorMessage}`);
            throw error;
        }
    }
    getPublicUrl(key) {
        return `${config_1.config.r2.publicUrl}/${key}`;
    }
};
exports.R2StorageAdapter = R2StorageAdapter;
exports.R2StorageAdapter = R2StorageAdapter = R2StorageAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], R2StorageAdapter);
//# sourceMappingURL=r2-storage.adapter.js.map