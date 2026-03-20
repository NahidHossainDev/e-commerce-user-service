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
exports.ProductInventoryHistorySchema = exports.ProductInventoryHistory = exports.InventoryTransactionType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var InventoryTransactionType;
(function (InventoryTransactionType) {
    InventoryTransactionType["RESTOCK"] = "RESTOCK";
    InventoryTransactionType["SALE"] = "SALE";
    InventoryTransactionType["RETURN"] = "RETURN";
    InventoryTransactionType["ADJUSTMENT"] = "ADJUSTMENT";
    InventoryTransactionType["INITIAL"] = "INITIAL";
})(InventoryTransactionType || (exports.InventoryTransactionType = InventoryTransactionType = {}));
let ProductInventoryHistory = class ProductInventoryHistory {
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
};
exports.ProductInventoryHistory = ProductInventoryHistory;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Product', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProductInventoryHistory.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'ProductInventory',
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProductInventoryHistory.prototype, "inventoryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], ProductInventoryHistory.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ProductInventoryHistory.prototype, "variantSku", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], ProductInventoryHistory.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ProductInventoryHistory.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], ProductInventoryHistory.prototype, "quantityBefore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], ProductInventoryHistory.prototype, "quantityAfter", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], ProductInventoryHistory.prototype, "unitCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], ProductInventoryHistory.prototype, "totalCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: InventoryTransactionType }),
    __metadata("design:type", String)
], ProductInventoryHistory.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ProductInventoryHistory.prototype, "referenceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProductInventoryHistory.prototype, "performedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ProductInventoryHistory.prototype, "note", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ProductInventoryHistory.prototype, "reason", void 0);
exports.ProductInventoryHistory = ProductInventoryHistory = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'product_inventory_histories' })
], ProductInventoryHistory);
exports.ProductInventoryHistorySchema = mongoose_1.SchemaFactory.createForClass(ProductInventoryHistory);
exports.ProductInventoryHistorySchema.index({ productId: 1, date: -1 });
exports.ProductInventoryHistorySchema.index({ sku: 1, date: -1 });
//# sourceMappingURL=inventory-history.schema.js.map