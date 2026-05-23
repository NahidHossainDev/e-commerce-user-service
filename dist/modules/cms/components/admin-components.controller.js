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
exports.AdminCmsComponentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_helper_1 = require("../../../utils/response/swagger.helper");
const components_service_1 = require("./components.service");
const component_constants_1 = require("./constants/component.constants");
const component_dto_1 = require("./dto/component.dto");
const component_schema_1 = require("./schemas/component.schema");
let AdminCmsComponentsController = class AdminCmsComponentsController {
    componentsService;
    constructor(componentsService) {
        this.componentsService = componentsService;
    }
    async getComponentTypes() {
        return component_constants_1.COMPONENT_REGISTRY;
    }
    async create(pageId, dto) {
        return await this.componentsService.create(pageId, dto);
    }
    async update(id, dto) {
        return await this.componentsService.update(id, dto);
    }
    async remove(id) {
        return await this.componentsService.remove(id);
    }
    async duplicate(id) {
        return await this.componentsService.duplicateComponent(id);
    }
    async reorder(dto) {
        await this.componentsService.reorder(dto);
        return { message: 'Components successfully reordered' };
    }
};
exports.AdminCmsComponentsController = AdminCmsComponentsController;
__decorate([
    (0, common_1.Get)('admin/cms/component-types'),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve metadata definitions and configurable fields for all component types',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCmsComponentsController.prototype, "getComponentTypes", null);
__decorate([
    (0, common_1.Post)('admin/cms/pages/:pageId/components'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new CMS component to a specific page' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Component successfully added.',
        type: component_schema_1.CmsComponent,
    }),
    __param(0, (0, common_1.Param)('pageId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, component_dto_1.CreateCmsComponentDto]),
    __metadata("design:returntype", Promise)
], AdminCmsComponentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('admin/cms/components/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update settings or properties of a specific component' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Component successfully updated.',
        type: component_schema_1.CmsComponent,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, component_dto_1.UpdateCmsComponentDto]),
    __metadata("design:returntype", Promise)
], AdminCmsComponentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('admin/cms/components/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a specific CMS component' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Component successfully deleted.',
        type: component_schema_1.CmsComponent,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCmsComponentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('admin/cms/components/:id/duplicate'),
    (0, swagger_1.ApiOperation)({ summary: 'Duplicate an existing CMS component' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Component successfully duplicated.',
        type: component_schema_1.CmsComponent,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCmsComponentsController.prototype, "duplicate", null);
__decorate([
    (0, common_1.Patch)('admin/cms/components/reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder multiple components in a batch' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [component_dto_1.ReorderComponentsDto]),
    __metadata("design:returntype", Promise)
], AdminCmsComponentsController.prototype, "reorder", null);
exports.AdminCmsComponentsController = AdminCmsComponentsController = __decorate([
    (0, swagger_1.ApiTags)('Admin CMS Components'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [components_service_1.CmsComponentsService])
], AdminCmsComponentsController);
//# sourceMappingURL=admin-components.controller.js.map