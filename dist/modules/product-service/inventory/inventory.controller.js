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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_helper_1 = require("../../../utils/response/swagger.helper");
const inventory_dto_1 = require("./dto/inventory.dto");
const inventory_response_dto_1 = require("./dto/inventory-response.dto");
const inventory_service_1 = require("./inventory.service");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async create(createInventoryDto) {
        return (await this.inventoryService.create(createInventoryDto));
    }
    async findByProductId(productId) {
        return (await this.inventoryService.findByProductId(productId));
    }
    async update(productId, updateInventoryDto) {
        return (await this.inventoryService.update(productId, updateInventoryDto));
    }
    async adjustStock(productId, adjustStockDto) {
        return (await this.inventoryService.adjustStock(productId, adjustStockDto));
    }
    async getHistory(productId) {
        return (await this.inventoryService.getHistory(productId));
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create inventory for a product' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 201,
        description: 'Inventory created successfully.',
        type: inventory_response_dto_1.ProductInventoryResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_dto_1.CreateInventoryDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory by product ID' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Inventory found.',
        type: inventory_response_dto_1.ProductInventoryResponseDto,
    }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findByProductId", null);
__decorate([
    (0, common_1.Patch)(':productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update inventory settings by product ID' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Inventory updated successfully.',
        type: inventory_response_dto_1.ProductInventoryResponseDto,
    }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_dto_1.UpdateInventoryDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':productId/adjust'),
    (0, swagger_1.ApiOperation)({ summary: 'Adjust stock quantity' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 201,
        description: 'Stock adjusted successfully.',
        type: inventory_response_dto_1.ProductInventoryResponseDto,
    }),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, inventory_dto_1.AdjustStockDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "adjustStock", null);
__decorate([
    (0, common_1.Get)(':productId/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory history for a product' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Inventory history found.',
        type: inventory_response_dto_1.ProductInventoryHistoryResponseDto,
        isArray: true,
    }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getHistory", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('Inventory'),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map