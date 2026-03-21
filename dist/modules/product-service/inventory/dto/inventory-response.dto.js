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
exports.ProductInventoryHistoryResponseDto = exports.ProductInventoryResponseDto = exports.VariantStockDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const inventory_history_schema_1 = require("../schemas/inventory-history.schema");
class VariantStockDto {
    variantSku;
    stockQuantity;
    reservedQuantity;
    lowStockThreshold;
}
exports.VariantStockDto = VariantStockDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SKU-001-RED' }),
    __metadata("design:type", String)
], VariantStockDto.prototype, "variantSku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], VariantStockDto.prototype, "stockQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], VariantStockDto.prototype, "reservedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], VariantStockDto.prototype, "lowStockThreshold", void 0);
class ProductInventoryResponseDto {
    productId;
    sku;
    barcode;
    stockQuantity;
    reservedQuantity;
    lowStockThreshold;
    isActive;
    warehouseLocation;
    totalSold;
    lastRestockedAt;
    lastSoldAt;
    variantStock;
}
exports.ProductInventoryResponseDto = ProductInventoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e1' }),
    __metadata("design:type", Object)
], ProductInventoryResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sku-001' }),
    __metadata("design:type", String)
], ProductInventoryResponseDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456789' }),
    __metadata("design:type", String)
], ProductInventoryResponseDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500 }),
    __metadata("design:type", Number)
], ProductInventoryResponseDto.prototype, "stockQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], ProductInventoryResponseDto.prototype, "reservedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], ProductInventoryResponseDto.prototype, "lowStockThreshold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], ProductInventoryResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Warehouse A, Shelf 1' }),
    __metadata("design:type", String)
], ProductInventoryResponseDto.prototype, "warehouseLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000 }),
    __metadata("design:type", Number)
], ProductInventoryResponseDto.prototype, "totalSold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], ProductInventoryResponseDto.prototype, "lastRestockedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], ProductInventoryResponseDto.prototype, "lastSoldAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [VariantStockDto] }),
    __metadata("design:type", Array)
], ProductInventoryResponseDto.prototype, "variantStock", void 0);
class ProductInventoryHistoryResponseDto {
    productId;
    inventoryId;
    sku;
    variantSku;
    date;
    quantity;
    quantityBefore;
    quantityAfter;
    unitCost;
    totalCost;
    type;
    referenceId;
    performedBy;
    note;
    reason;
}
exports.ProductInventoryHistoryResponseDto = ProductInventoryHistoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e1' }),
    __metadata("design:type", Object)
], ProductInventoryHistoryResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e2' }),
    __metadata("design:type", Object)
], ProductInventoryHistoryResponseDto.prototype, "inventoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sku-001' }),
    __metadata("design:type", String)
], ProductInventoryHistoryResponseDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sku-001-red' }),
    __metadata("design:type", String)
], ProductInventoryHistoryResponseDto.prototype, "variantSku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", Date)
], ProductInventoryHistoryResponseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], ProductInventoryHistoryResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], ProductInventoryHistoryResponseDto.prototype, "quantityBefore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 110 }),
    __metadata("design:type", Number)
], ProductInventoryHistoryResponseDto.prototype, "quantityAfter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    __metadata("design:type", Number)
], ProductInventoryHistoryResponseDto.prototype, "unitCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500 }),
    __metadata("design:type", Number)
], ProductInventoryHistoryResponseDto.prototype, "totalCost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: inventory_history_schema_1.InventoryTransactionType,
        example: inventory_history_schema_1.InventoryTransactionType.RESTOCK,
    }),
    __metadata("design:type", String)
], ProductInventoryHistoryResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'RESTOCK-123' }),
    __metadata("design:type", String)
], ProductInventoryHistoryResponseDto.prototype, "referenceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e3' }),
    __metadata("design:type", Object)
], ProductInventoryHistoryResponseDto.prototype, "performedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Monthly restock' }),
    __metadata("design:type", String)
], ProductInventoryHistoryResponseDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Restock from supplier' }),
    __metadata("design:type", String)
], ProductInventoryHistoryResponseDto.prototype, "reason", void 0);
//# sourceMappingURL=inventory-response.dto.js.map