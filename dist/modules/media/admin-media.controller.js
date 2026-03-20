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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMediaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const user_schema_1 = require("../user-service/user/user.schema");
const temp_cleanup_response_dto_1 = require("./dto/temp-cleanup-response.dto");
const media_service_1 = require("./media.service");
let AdminMediaController = class AdminMediaController {
    mediaService;
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    async cleanupTempFiles() {
        const result = await this.mediaService.cleanupTempFiles();
        return {
            ...result,
            message: result.deletedCount > 0
                ? `Successfully cleaned up ${result.deletedCount} temporary media files.`
                : 'No expired temporary media files found.',
        };
    }
};
exports.AdminMediaController = AdminMediaController;
__decorate([
    (0, common_1.Post)('cleanup-temp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Clean up expired temporary media files (Admin)' }),
    (0, swagger_1.ApiResponse)({ type: temp_cleanup_response_dto_1.TempCleanupResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminMediaController.prototype, "cleanupTempFiles", null);
exports.AdminMediaController = AdminMediaController = __decorate([
    (0, swagger_1.ApiTags)('Admin / Media'),
    (0, common_1.Controller)('admin/media'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], AdminMediaController);
//# sourceMappingURL=admin-media.controller.js.map