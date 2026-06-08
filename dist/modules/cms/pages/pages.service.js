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
exports.CmsPagesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const slug_helper_1 = require("../../../utils/helpers/slug.helper");
const components_service_1 = require("../components/components.service");
const page_enum_1 = require("./enums/page.enum");
const pages_repository_1 = require("./pages.repository");
let CmsPagesService = class CmsPagesService {
    pagesRepository;
    componentsService;
    connection;
    constructor(pagesRepository, componentsService, connection) {
        this.pagesRepository = pagesRepository;
        this.componentsService = componentsService;
        this.connection = connection;
    }
    async create(dto) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const slug = dto.slug ? (0, slug_helper_1.createSlug)(dto.slug) : (0, slug_helper_1.createSlug)(dto.title);
            const existing = await this.pagesRepository.findBySlug(slug);
            if (existing) {
                throw new common_1.ConflictException(`CMS Page with slug '${slug}' already exists`);
            }
            const page = await this.pagesRepository.create({ ...dto, slug }, session);
            if (dto.isHomePage) {
                await this.pagesRepository.unsetHomePage(page._id.toString(), session);
            }
            await session.commitTransaction();
            return page;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    }
    async findOne(id) {
        const page = await this.pagesRepository.findById(id);
        if (!page) {
            throw new common_1.NotFoundException(`CMS Page with ID ${id} not found`);
        }
        return page;
    }
    async findOneBySlug(slug) {
        const page = await this.pagesRepository.findBySlug(slug);
        if (!page) {
            throw new common_1.NotFoundException(`CMS Page with slug '${slug}' not found`);
        }
        return page;
    }
    async getPageForStorefront(slug, previewToken) {
        let page = null;
        if (!slug) {
            page = await this.pagesRepository.findHomePage();
            if (!page) {
                throw new common_1.NotFoundException('Homepage not found');
            }
        }
        else {
            if (slug.toLowerCase() === 'home' || slug.toLowerCase() === 'homepage') {
                page = await this.pagesRepository.findHomePage();
            }
            if (!page) {
                page = await this.pagesRepository.findBySlug(slug);
            }
            if (!page) {
                throw new common_1.NotFoundException(`CMS Page with slug '${slug}' not found`);
            }
        }
        if (page.status === page_enum_1.CmsPageStatus.DRAFT) {
            const isValidToken = previewToken && this.validatePreviewToken(page._id.toString(), previewToken);
            if (!isValidToken) {
                throw new common_1.NotFoundException(`CMS Page ${slug ? `with slug '${slug}' ` : ''}not found`);
            }
        }
        const components = await this.componentsService.findByPageId(page._id.toString(), true);
        return {
            page: {
                id: page._id,
                title: page.title,
                slug: page.slug,
                seo: page.seo,
                components,
            },
        };
    }
    async getAdminPageDetails(id) {
        const page = await this.findOne(id);
        const components = await this.componentsService.findByPageId(page._id.toString(), false);
        return {
            ...page.toObject(),
            components,
            previewToken: this.generatePreviewToken(page._id.toString()),
        };
    }
    async findAll(queryDto) {
        return await this.pagesRepository.findAll(queryDto);
    }
    async update(id, dto) {
        const page = await this.findOne(id);
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            if (page.type === page_enum_1.CmsPageType.SYSTEM) {
                if (dto.slug && (0, slug_helper_1.createSlug)(dto.slug) !== page.slug) {
                    throw new common_1.BadRequestException('Cannot change the slug of a protected SYSTEM page');
                }
            }
            let slug = page.slug;
            if (dto.slug && (0, slug_helper_1.createSlug)(dto.slug) !== page.slug) {
                slug = (0, slug_helper_1.createSlug)(dto.slug);
                const existing = await this.pagesRepository.findBySlug(slug);
                if (existing) {
                    throw new common_1.ConflictException(`CMS Page with slug '${slug}' already exists`);
                }
            }
            else if (dto.title && !dto.slug && page.type !== page_enum_1.CmsPageType.SYSTEM) {
                slug = (0, slug_helper_1.createSlug)(dto.title);
                const existing = await this.pagesRepository.findBySlug(slug);
                if (existing && existing._id.toString() !== id) {
                    slug = `${slug}-${Date.now().toString().slice(-4)}`;
                }
            }
            const updated = await this.pagesRepository.update(id, { ...dto, slug }, session);
            if (dto.isHomePage) {
                await this.pagesRepository.unsetHomePage(id, session);
            }
            await session.commitTransaction();
            return updated;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    }
    async remove(id) {
        const page = await this.findOne(id);
        if (page.isHomePage) {
            throw new common_1.BadRequestException('The home page is protected and cannot be deleted');
        }
        if (page.type === page_enum_1.CmsPageType.SYSTEM) {
            throw new common_1.BadRequestException('SYSTEM pages are protected and cannot be deleted');
        }
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            await this.pagesRepository.delete(id, session);
            await this.componentsService.removeByPageId(id, session);
            await session.commitTransaction();
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    }
    async duplicatePage(id) {
        const sourcePage = await this.findOne(id);
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            let slug = `${sourcePage.slug}-copy`;
            let count = 1;
            while (await this.pagesRepository.findBySlug(slug)) {
                slug = `${sourcePage.slug}-copy-${count}`;
                count++;
            }
            const clonedPage = await this.pagesRepository.create({
                title: `${sourcePage.title} (Copy)`,
                slug,
                type: page_enum_1.CmsPageType.CUSTOM,
                status: page_enum_1.CmsPageStatus.DRAFT,
                isHomePage: false,
                seo: sourcePage.seo,
            }, session);
            const clonedComponents = await this.componentsService.cloneComponentsForPage(sourcePage._id.toString(), clonedPage._id.toString(), session);
            const componentIds = clonedComponents.map((c) => c._id);
            const updatedClonedPage = await this.pagesRepository.update(clonedPage._id.toString(), { componentIds }, session);
            await session.commitTransaction();
            return updatedClonedPage;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    }
    generatePreviewToken(pageId) {
        const secret = 'CMS-PREVIEW-SYSTEM-SECRET-KEY';
        return Buffer.from(`${pageId}:${secret}`).toString('base64');
    }
    validatePreviewToken(pageId, token) {
        return token === this.generatePreviewToken(pageId);
    }
};
exports.CmsPagesService = CmsPagesService;
exports.CmsPagesService = CmsPagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [pages_repository_1.CmsPagesRepository,
        components_service_1.CmsComponentsService,
        mongoose_2.Connection])
], CmsPagesService);
//# sourceMappingURL=pages.service.js.map