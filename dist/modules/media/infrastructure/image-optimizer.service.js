"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ImageOptimizerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageOptimizerService = void 0;
const common_1 = require("@nestjs/common");
const sharp = require("sharp");
let ImageOptimizerService = ImageOptimizerService_1 = class ImageOptimizerService {
    logger = new common_1.Logger(ImageOptimizerService_1.name);
    async convertToWebP(file) {
        try {
            return await sharp(file)
                .webp({ quality: 80 })
                .toBuffer({ resolveWithObject: true });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to optimize image: ${errorMessage}`);
            throw error;
        }
    }
    async getMetadata(file) {
        try {
            return await sharp(file).metadata();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to get image metadata: ${errorMessage}`);
            throw error;
        }
    }
    isImage(mimeType) {
        return mimeType.startsWith('image/');
    }
    isVideo(mimeType) {
        return mimeType.startsWith('video/');
    }
    isDocument(mimeType) {
        const documentMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
        ];
        return documentMimeTypes.includes(mimeType);
    }
};
exports.ImageOptimizerService = ImageOptimizerService;
exports.ImageOptimizerService = ImageOptimizerService = ImageOptimizerService_1 = __decorate([
    (0, common_1.Injectable)()
], ImageOptimizerService);
//# sourceMappingURL=image-optimizer.service.js.map