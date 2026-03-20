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
exports.AdjustStockDto = exports.UpdateInventoryDto = exports.CreateInventoryDto = exports.VariantStockDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const inventory_history_schema_1 = require("../schemas/inventory-history.schema");
class VariantStockDto {
    variantSku;
    stockQuantity;
    reservedQuantity;
    lowStockThreshold;
}
exports.VariantStockDto = VariantStockDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SKU of the variant' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VariantStockDto.prototype, "variantSku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Stock quantity of the variant', default: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], VariantStockDto.prototype, "stockQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reserved quantity of the variant', default: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VariantStockDto.prototype, "reservedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Low stock threshold for the variant',
        default: 5,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VariantStockDto.prototype, "lowStockThreshold", void 0);
class CreateInventoryDto {
    productId;
    sku;
    barcode;
    stockQuantity;
    reservedQuantity;
    lowStockThreshold;
    warehouseLocation;
    variantStock;
}
exports.CreateInventoryDto = CreateInventoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product ID' }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base SKU of the product' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Barcode of the product', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Stock quantity of the product', default: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryDto.prototype, "stockQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reserved quantity of the product', default: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateInventoryDto.prototype, "reservedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Low stock threshold for the product',
        default: 5,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryDto.prototype, "lowStockThreshold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Warehouse location', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "warehouseLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [VariantStockDto],
        description: 'Stock information for variants',
        default: [],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => VariantStockDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateInventoryDto.prototype, "variantStock", void 0);
class UpdateInventoryDto extends (0, swagger_1.PartialType)(CreateInventoryDto) {
    isActive;
}
exports.UpdateInventoryDto = UpdateInventoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is the inventory active', required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateInventoryDto.prototype, "isActive", void 0);
class AdjustStockDto {
    quantity;
    type;
    variantSku;
    referenceId;
    reason;
    note;
}
exports.AdjustStockDto = AdjustStockDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity to add or subtract (e.g. 5 or -5)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AdjustStockDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of transaction',
        enum: inventory_history_schema_1.InventoryTransactionType,
    }),
    (0, class_validator_1.IsEnum)(inventory_history_schema_1.InventoryTransactionType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AdjustStockDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variant SKU if adjusting variant stock',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdjustStockDto.prototype, "variantSku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reference ID (e.g. Order ID)', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdjustStockDto.prototype, "referenceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for adjustment', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdjustStockDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notes', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdjustStockDto.prototype, "note", void 0);
//# sourceMappingURL=inventory.dto.js.map