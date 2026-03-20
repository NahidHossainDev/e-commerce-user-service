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
exports.AdminProductController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../../common/guards/roles.guard");
const user_schema_1 = require("../../../user-service/user/user.schema");
const product_query_options_dto_1 = require("../dto/product-query-options.dto");
const product_dto_1 = require("../dto/product.dto");
const update_product_status_dto_1 = require("../dto/update-product-status.dto");
const product_service_1 = require("../product.service");
let AdminProductController = class AdminProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    create(createProductDto) {
        return this.productService.create(createProductDto);
    }
    findAll(queryDto) {
        return this.productService.findAllAdmin(queryDto);
    }
    findOne(id) {
        return this.productService.findOneAdmin(id);
    }
    update(id, updateProductDto) {
        return this.productService.update(id, updateProductDto);
    }
    remove(id) {
        return this.productService.remove(id);
    }
    hardDelete(id) {
        return this.productService.hardDelete(id);
    }
    updateStatus(id, dto) {
        return this.productService.updateStatus(id, dto.status);
    }
    restore(id) {
        return this.productService.restore(id);
    }
    bulkUpdateStatus(dto) {
        return this.productService.bulkUpdateStatus(dto.ids, dto.status);
    }
};
exports.AdminProductController = AdminProductController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], AdminProductController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products (Admin View)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_query_options_dto_1.ProductQueryDto]),
    __metadata("design:returntype", void 0)
], AdminProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product by ID (Admin View)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a product' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], AdminProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a product' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminProductController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(':id/hard'),
    (0, swagger_1.ApiOperation)({ summary: 'Hard delete a product (Permanent)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminProductController.prototype, "hardDelete", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update product status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_status_dto_1.UpdateProductStatusDto]),
    __metadata("design:returntype", void 0)
], AdminProductController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/restore'),
    (0, swagger_1.ApiOperation)({ summary: 'Restore a soft-deleted product' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminProductController.prototype, "restore", null);
__decorate([
    (0, common_1.Patch)('bulk/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update product status' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_product_status_dto_1.BulkUpdateStatusDto]),
    __metadata("design:returntype", void 0)
], AdminProductController.prototype, "bulkUpdateStatus", null);
exports.AdminProductController = AdminProductController = __decorate([
    (0, swagger_1.ApiTags)('Admin Products'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    (0, common_1.Controller)('admin/products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], AdminProductController);
//# sourceMappingURL=admin-product.controller.js.map