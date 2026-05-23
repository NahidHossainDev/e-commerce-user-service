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
exports.AdminCmsPagesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_helper_1 = require("../../../utils/response/swagger.helper");
const page_dto_1 = require("./dto/page.dto");
const pages_service_1 = require("./pages.service");
const page_schema_1 = require("./schemas/page.schema");
let AdminCmsPagesController = class AdminCmsPagesController {
    pagesService;
    constructor(pagesService) {
        this.pagesService = pagesService;
    }
    async create(dto) {
        return await this.pagesService.create(dto);
    }
    async findAll(queryDto) {
        return await this.pagesService.findAll(queryDto);
    }
    async findOne(id) {
        return await this.pagesService.getAdminPageDetails(id);
    }
    async update(id, dto) {
        return await this.pagesService.update(id, dto);
    }
    async remove(id) {
        await this.pagesService.remove(id);
        return { message: 'CMS Page and all associated components successfully deleted' };
    }
    async duplicate(id) {
        return await this.pagesService.duplicatePage(id);
    }
};
exports.AdminCmsPagesController = AdminCmsPagesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new CMS page' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Page successfully created.',
        type: page_schema_1.CmsPage,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.CreateCmsPageDto]),
    __metadata("design:returntype", Promise)
], AdminCmsPagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all pages with search, filters and pagination',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [page_dto_1.QueryCmsPageDto]),
    __metadata("design:returntype", Promise)
], AdminCmsPagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve details of a page by ID (including child components)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCmsPagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update page options, status, SEO, and title' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Page successfully updated.',
        type: page_schema_1.CmsPage,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, page_dto_1.UpdateCmsPageDto]),
    __metadata("design:returntype", Promise)
], AdminCmsPagesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a page and cascade-delete its components' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCmsPagesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    (0, swagger_1.ApiOperation)({ summary: 'Duplicate an entire CMS page alongside all its child components' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Page successfully duplicated.',
        type: page_schema_1.CmsPage,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCmsPagesController.prototype, "duplicate", null);
exports.AdminCmsPagesController = AdminCmsPagesController = __decorate([
    (0, swagger_1.ApiTags)('Admin CMS Pages'),
    (0, common_1.Controller)('admin/cms/pages'),
    __metadata("design:paramtypes", [pages_service_1.CmsPagesService])
], AdminCmsPagesController);
//# sourceMappingURL=admin-pages.controller.js.map