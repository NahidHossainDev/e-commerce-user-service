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
exports.AdminCategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../../common/guards/roles.guard");
const user_schema_1 = require("../../../user-service/user/user.schema");
const swagger_helper_1 = require("../../../../utils/response/swagger.helper");
const category_service_1 = require("../category.service");
const category_query_options_dto_1 = require("../dto/category-query-options.dto");
const category_response_dto_1 = require("../dto/category-response.dto");
const create_category_dto_1 = require("../dto/create-category.dto");
const update_category_dto_1 = require("../dto/update-category.dto");
let AdminCategoryController = class AdminCategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async create(createCategoryDto) {
        return (await this.categoryService.create(createCategoryDto));
    }
    async findAll(query) {
        return (await this.categoryService.findAll(query));
    }
    async findOne(id) {
        return (await this.categoryService.findOne(id));
    }
    async update(id, updateCategoryDto) {
        return (await this.categoryService.update(id, updateCategoryDto));
    }
    async remove(id) {
        return (await this.categoryService.remove(id));
    }
};
exports.AdminCategoryController = AdminCategoryController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new category' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 201,
        description: 'Category created successfully.',
        type: category_response_dto_1.CategoryResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories with pagination and filtering' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Paginated list of categories.',
        type: category_response_dto_1.PaginatedCategoriesResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_query_options_dto_1.CategoryQueryOptionsDto]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a category by ID' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Category found.',
        type: category_response_dto_1.CategoryResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a category' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Category updated successfully.',
        type: category_response_dto_1.CategoryResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a category' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Category deleted successfully.',
        type: category_response_dto_1.CategoryResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "remove", null);
exports.AdminCategoryController = AdminCategoryController = __decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, common_1.Controller)('admin/categories'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], AdminCategoryController);
//# sourceMappingURL=admin-category.controller.js.map