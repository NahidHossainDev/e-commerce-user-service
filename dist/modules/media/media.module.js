"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_media_controller_1 = require("./admin-media.controller");
const image_optimizer_service_1 = require("./infrastructure/image-optimizer.service");
const media_schema_1 = require("./infrastructure/schemas/media.schema");
const media_listener_1 = require("./listeners/media.listener");
const media_controller_1 = require("./media.controller");
const media_service_1 = require("./media.service");
const storage_factory_1 = require("./storage/storage.factory");
let MediaModule = class MediaModule {
};
exports.MediaModule = MediaModule;
exports.MediaModule = MediaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: media_schema_1.Media.name, schema: media_schema_1.MediaSchema }]),
        ],
        controllers: [media_controller_1.MediaController, admin_media_controller_1.AdminMediaController],
        providers: [
            media_service_1.MediaService,
            storage_factory_1.StorageFactory,
            image_optimizer_service_1.ImageOptimizerService,
            media_listener_1.MediaListener,
        ],
        exports: [media_service_1.MediaService],
    })
], MediaModule);
//# sourceMappingURL=media.module.js.map