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
exports.ProductInventorySchema = exports.ProductInventory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ProductInventory = class ProductInventory {
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
};
exports.ProductInventory = ProductInventory;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Product',
        required: true,
        unique: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProductInventory.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], ProductInventory.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, sparse: true, trim: true }),
    __metadata("design:type", String)
], ProductInventory.prototype, "barcode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0, min: 0 }),
    __metadata("design:type", Number)
], ProductInventory.prototype, "stockQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, default: 0 }),
    __metadata("design:type", Number)
], ProductInventory.prototype, "reservedQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 5, min: 0 }),
    __metadata("design:type", Number)
], ProductInventory.prototype, "lowStockThreshold", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ProductInventory.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ProductInventory.prototype, "warehouseLocation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], ProductInventory.prototype, "totalSold", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ProductInventory.prototype, "lastRestockedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ProductInventory.prototype, "lastSoldAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], ProductInventory.prototype, "variantStock", void 0);
exports.ProductInventory = ProductInventory = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'product_inventories' })
], ProductInventory);
exports.ProductInventorySchema = mongoose_1.SchemaFactory.createForClass(ProductInventory);
exports.ProductInventorySchema.index({ sku: 1 });
exports.ProductInventorySchema.index({ productId: 1 }, { unique: true });
//# sourceMappingURL=inventory.schema.js.map