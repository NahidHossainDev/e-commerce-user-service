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
exports.PublicCategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_helper_1 = require("../../../../utils/response/swagger.helper");
const category_service_1 = require("../category.service");
const category_response_dto_1 = require("../dto/category-response.dto");
let PublicCategoryController = class PublicCategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async findAll() {
        return (await this.categoryService.findAllPublic());
    }
    async getTree() {
        return (await this.categoryService.getPublicCategoryTree());
    }
    async getParentCategories() {
        const categories = await this.categoryService.getParentCategories();
        return categories;
    }
    async getSubCategories(parentId) {
        const categories = await this.categoryService.getSubCategories(parentId);
        return categories;
    }
    async findByIds(ids) {
        const idList = ids ? ids.split(',') : [];
        const categories = await this.categoryService.findByIds(idList);
        return categories;
    }
    async getBySlug(slug) {
        return (await this.categoryService.getBySlug(slug));
    }
};
exports.PublicCategoryController = PublicCategoryController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active categories' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'List of active categories.',
        type: category_response_dto_1.CategoryResponseDto,
        isArray: true,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicCategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tree'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the full category tree' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Hierarchical tree of categories.',
        type: category_response_dto_1.CategoryTreeResponseDto,
        isArray: true,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicCategoryController.prototype, "getTree", null);
__decorate([
    (0, common_1.Get)('parent-category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all parent categories (level 0)' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'List of parent categories.',
        type: category_response_dto_1.MinimalCategoryTreeDto,
        isArray: true,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicCategoryController.prototype, "getParentCategories", null);
__decorate([
    (0, common_1.Get)(':parentId/sub-category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sub-categories for a parent category' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Nested sub-categories for the parent.',
        type: category_response_dto_1.MinimalCategoryTreeDto,
        isArray: true,
    }),
    __param(0, (0, common_1.Param)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicCategoryController.prototype, "getSubCategories", null);
__decorate([
    (0, common_1.Get)('by-ids'),
    (0, swagger_1.ApiOperation)({ summary: 'Get categories by a list of IDs' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'List of categories matching the IDs.',
        type: category_response_dto_1.CategoryResponseDto,
        isArray: true,
    }),
    __param(0, (0, common_1.Query)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicCategoryController.prototype, "findByIds", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a category by slug' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Category found.',
        type: category_response_dto_1.CategoryResponseDto,
    }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicCategoryController.prototype, "getBySlug", null);
exports.PublicCategoryController = PublicCategoryController = __decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], PublicCategoryController);
//# sourceMappingURL=public-category.controller.js.map