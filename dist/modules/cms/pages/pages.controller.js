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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsPagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pages_service_1 = require("./pages.service");
let CmsPagesController = class CmsPagesController {
    pagesService;
    constructor(pagesService) {
        this.pagesService = pagesService;
    }
    async getPage(slug, previewToken) {
        return await this.pagesService.getPageForStorefront(slug, previewToken);
    }
};
exports.CmsPagesController = CmsPagesController;
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({
        summary: 'Fetch fully assembled page and component schemas by slug for storefront rendering',
    }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Query)('previewToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CmsPagesController.prototype, "getPage", null);
exports.CmsPagesController = CmsPagesController = __decorate([
    (0, swagger_1.ApiTags)('CMS Public Storefront'),
    (0, common_1.Controller)('cms'),
    __metadata("design:paramtypes", [pages_service_1.CmsPagesService])
], CmsPagesController);
//# sourceMappingURL=pages.controller.js.map