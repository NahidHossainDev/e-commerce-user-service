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
exports.CmsComponentsService = void 0;
const common_1 = require("@nestjs/common");
const components_repository_1 = require("./components.repository");
const validation_service_1 = require("./validation.service");
let CmsComponentsService = class CmsComponentsService {
    componentsRepository;
    validationService;
    constructor(componentsRepository, validationService) {
        this.componentsRepository = componentsRepository;
        this.validationService = validationService;
    }
    async create(pageId, dto, session) {
        const validatedData = await this.validationService.validateData(dto.componentType, dto.data);
        dto.data = validatedData;
        return await this.componentsRepository.create(pageId, dto, session);
    }
    async findOne(id) {
        const component = await this.componentsRepository.findById(id);
        if (!component) {
            throw new common_1.NotFoundException(`CMS Component with ID ${id} not found`);
        }
        return component;
    }
    async findByPageId(pageId, filterVisible = false) {
        return await this.componentsRepository.findByPageId(pageId, filterVisible);
    }
    async update(id, dto, session) {
        const existing = await this.findOne(id);
        if (dto.data) {
            const type = dto.componentType || existing.componentType;
            const validatedData = await this.validationService.validateData(type, dto.data);
            dto.data = validatedData;
        }
        return await this.componentsRepository.update(id, dto, session);
    }
    async remove(id, session) {
        return await this.componentsRepository.delete(id, session);
    }
    async removeByPageId(pageId, session) {
        await this.componentsRepository.deleteByPageId(pageId, session);
    }
    async reorder(dto, session) {
        await this.componentsRepository.reorder(dto.components, session);
    }
    async duplicateComponent(id, session) {
        const source = await this.findOne(id);
        const createDto = {
            componentType: source.componentType,
            order: source.order + 1,
            isVisible: source.isVisible,
            settings: source.settings,
            data: source.data,
        };
        return await this.componentsRepository.create(source.pageId.toString(), createDto, session);
    }
    async cloneComponentsForPage(sourcePageId, targetPageId, session) {
        return await this.componentsRepository.cloneComponents(sourcePageId, targetPageId, session);
    }
};
exports.CmsComponentsService = CmsComponentsService;
exports.CmsComponentsService = CmsComponentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [components_repository_1.CmsComponentsRepository,
        validation_service_1.ComponentValidationService])
], CmsComponentsService);
//# sourceMappingURL=components.service.js.map