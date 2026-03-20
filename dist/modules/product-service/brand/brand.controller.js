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
exports.BrandController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const brand_service_1 = require("./brand.service");
const brand_query_options_dto_1 = require("./dto/brand-query-options.dto");
const create_brand_dto_1 = require("./dto/create-brand.dto");
const update_brand_dto_1 = require("./dto/update-brand.dto");
let BrandController = class BrandController {
    brandService;
    constructor(brandService) {
        this.brandService = brandService;
    }
    create(createBrandDto) {
        return this.brandService.create(createBrandDto);
    }
    findAll(query) {
        return this.brandService.findAll(query);
    }
    findOne(id) {
        return this.brandService.findOne(id);
    }
    update(id, updateBrandDto) {
        return this.brandService.update(id, updateBrandDto);
    }
    remove(id) {
        return this.brandService.remove(id);
    }
};
exports.BrandController = BrandController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new brand' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The brand has been successfully created.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Brand name or slug already exists.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_brand_dto_1.CreateBrandDto]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve all brands with pagination and filtering',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [brand_query_options_dto_1.BrandQueryOptionsDto]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a brand by ID' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Brand not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a brand by ID' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Brand not found.' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Brand name or slug already exists.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_brand_dto_1.UpdateBrandDto]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a brand by ID' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Brand not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "remove", null);
exports.BrandController = BrandController = __decorate([
    (0, swagger_1.ApiTags)('Brands'),
    (0, common_1.Controller)('brands'),
    __metadata("design:paramtypes", [brand_service_1.BrandService])
], BrandController);
//# sourceMappingURL=brand.controller.js.map