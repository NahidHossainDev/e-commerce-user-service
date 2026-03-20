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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MediaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const path = require("path");
const uuid_1 = require("uuid");
const config_1 = require("../../config");
const media_types_1 = require("./domain/media.types");
const image_optimizer_service_1 = require("./infrastructure/image-optimizer.service");
const media_schema_1 = require("./infrastructure/schemas/media.schema");
let MediaService = MediaService_1 = class MediaService {
    mediaModel;
    storageAdapter;
    imageOptimizer;
    logger = new common_1.Logger(MediaService_1.name);
    constructor(mediaModel, storageAdapter, imageOptimizer) {
        this.mediaModel = mediaModel;
        this.storageAdapter = storageAdapter;
        this.imageOptimizer = imageOptimizer;
    }
    async uploadFile(file) {
        const multerFile = file;
        if (multerFile.size > config_1.config.media.maxFileSize) {
            throw new common_1.BadRequestException(`File too large. Max size is ${config_1.config.media.maxFileSize / 1024 / 1024}MB`);
        }
        if (!config_1.config.media.allowedMimeTypes.includes(multerFile.mimetype)) {
            throw new common_1.BadRequestException(`Invalid file type: ${multerFile.mimetype}`);
        }
        const id = (0, uuid_1.v4)();
        const originalExtension = path
            .extname(multerFile.originalname)
            .toLowerCase();
        const mimeType = multerFile.mimetype;
        let type = media_types_1.MediaType.OTHER;
        let finalBuffer = multerFile.buffer;
        let finalFormat = originalExtension.replace('.', '');
        let width;
        let height;
        let finalMimeType = mimeType;
        if (this.imageOptimizer.isImage(mimeType)) {
            type = media_types_1.MediaType.IMAGE;
            try {
                const { data, info } = await this.imageOptimizer.convertToWebP(multerFile.buffer);
                finalBuffer = data;
                finalFormat = 'webp';
                width = info.width;
                height = info.height;
                finalMimeType = 'image/webp';
            }
            catch {
                this.logger.warn(`Optimization failed for image ${multerFile.originalname}, using original.`);
            }
        }
        else if (this.imageOptimizer.isVideo(mimeType)) {
            type = media_types_1.MediaType.VIDEO;
        }
        else if (this.imageOptimizer.isDocument(mimeType)) {
            type = media_types_1.MediaType.DOCUMENT;
        }
        const storageKey = `tmp/${type}s/${id}.${finalFormat}`;
        try {
            const url = await this.storageAdapter.uploadFile(finalBuffer, storageKey, finalMimeType);
            const media = new this.mediaModel({
                id,
                url,
                storageKey,
                status: media_types_1.MediaStatus.TEMP,
                ownerId: null,
                ownerType: null,
                type,
                format: finalFormat,
                size: finalBuffer.length,
                width,
                height,
                originalName: multerFile.originalname,
                mimeType: finalMimeType,
            });
            try {
                await media.save();
            }
            catch (dbError) {
                await this.storageAdapter.deleteFile(storageKey);
                throw dbError;
            }
            return { id: media.id, url: media.url };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to process upload: ${errorMessage}`);
            throw new common_1.BadRequestException(`File upload failed: ${errorMessage}`);
        }
    }
    async getFileMetadata(id) {
        const media = await this.mediaModel.findOne({ id }).exec();
        if (!media) {
            throw new common_1.NotFoundException(`Media with ID ${id} not found`);
        }
        return this.mapToResponseDto(media);
    }
    async deleteFile(id) {
        const media = await this.mediaModel.findOne({ id }).exec();
        if (!media) {
            throw new common_1.NotFoundException(`Media with ID ${id} not found`);
        }
        await this.storageAdapter.deleteFile(media.storageKey);
        await this.mediaModel.deleteOne({ id }).exec();
    }
    async cleanupOrphanFiles() {
        try {
            const allStorageKeys = await this.storageAdapter.listObjects();
            const allDbMedia = await this.mediaModel
                .find({}, { storageKey: 1 })
                .exec();
            const dbKeys = new Set(allDbMedia.map((m) => m.storageKey));
            const orphanKeys = allStorageKeys.filter((key) => !dbKeys.has(key));
            if (orphanKeys.length > 0) {
                await Promise.all(orphanKeys.map((key) => this.storageAdapter.deleteFile(key)));
            }
            return {
                deletedCount: orphanKeys.length,
                deletedKeys: orphanKeys,
                message: orphanKeys.length > 0
                    ? `Successfully deleted ${orphanKeys.length} orphan files.`
                    : 'No orphan files found.',
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Orphan cleanup failed: ${errorMessage}`);
            throw new common_1.BadRequestException(`Cleanup failed: ${errorMessage}`);
        }
    }
    async cleanupTempFiles() {
        try {
            const expirationHours = config_1.config.media.tempFileExpirationHours || 24;
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() - expirationHours);
            const tempMedia = await this.mediaModel
                .find({
                status: media_types_1.MediaStatus.TEMP,
                createdAt: { $lt: expirationDate },
                storageKey: { $regex: /^tmp\// },
            })
                .exec();
            if (tempMedia.length === 0) {
                return { deletedCount: 0, deletedIds: [] };
            }
            const deletedIds = [];
            for (const media of tempMedia) {
                try {
                    const m = media;
                    const storageKey = m.storageKey;
                    await this.storageAdapter.deleteFile(storageKey);
                    deletedIds.push(m.id);
                }
                catch (err) {
                    const errMsg = err instanceof Error ? err.message : 'Unknown error';
                    this.logger.error(`Failed to delete storage file for media ID ${media.id}: ${errMsg}`);
                }
            }
            if (deletedIds.length > 0) {
                await this.mediaModel.deleteMany({ id: { $in: deletedIds } }).exec();
            }
            this.logger.log(`Cleaned up ${deletedIds.length} expired temporary media files.`);
            return {
                deletedCount: deletedIds.length,
                deletedIds,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Temp media cleanup failed: ${errorMessage}`);
            throw new common_1.BadRequestException(`Temp cleanup failed: ${errorMessage}`);
        }
    }
    async attachImage(event) {
        try {
            const media = await this.mediaModel.findOne({ id: event.mediaId }).exec();
            if (!media || media.status === media_types_1.MediaStatus.ACTIVE)
                return;
            const oldKey = media.storageKey;
            if (!oldKey.startsWith('tmp/'))
                return;
            const newKey = oldKey.replace('tmp/', '');
            await this.storageAdapter.copyFile(oldKey, newKey);
            await this.storageAdapter.deleteFile(oldKey);
            media.status = media_types_1.MediaStatus.ACTIVE;
            media.ownerId = event.ownerId;
            media.ownerType = event.ownerType;
            media.storageKey = newKey;
            media.url = this.storageAdapter.getPublicUrl(newKey);
            await media.save();
            this.logger.log(`Media ${media.id} attached to ${event.ownerType}:${event.ownerId}`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to handle image attachment: ${errorMessage}`);
        }
    }
    async detachImage(event) {
        try {
            const media = await this.mediaModel.findOne({ id: event.mediaId }).exec();
            if (!media || media.status === media_types_1.MediaStatus.TEMP)
                return;
            media.status = media_types_1.MediaStatus.TEMP;
            media.ownerId = undefined;
            media.ownerType = undefined;
            await media.save();
            this.logger.log(`Media ${media.id} detached`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to handle image detachment: ${errorMessage}`);
        }
    }
    mapToResponseDto(media) {
        return {
            id: media.id,
            url: media.url,
            storageKey: media.storageKey,
            status: media.status,
            ownerId: media.ownerId,
            ownerType: media.ownerType,
            type: media.type,
            format: media.format,
            width: media.width,
            height: media.height,
            size: media.size,
            originalName: media.originalName,
            createdAt: media.createdAt,
        };
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = MediaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(media_schema_1.Media.name)),
    __param(1, (0, common_1.Inject)('STORAGE_ADAPTER')),
    __metadata("design:paramtypes", [mongoose_2.Model, Object, image_optimizer_service_1.ImageOptimizerService])
], MediaService);
//# sourceMappingURL=media.service.js.map