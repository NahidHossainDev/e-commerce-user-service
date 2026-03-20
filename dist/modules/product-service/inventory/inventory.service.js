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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const inventory_events_1 = require("../../../common/events/inventory.events");
const product_schema_1 = require("../product/schemas/product.schema");
const inventory_history_schema_1 = require("./schemas/inventory-history.schema");
const inventory_schema_1 = require("./schemas/inventory.schema");
let InventoryService = class InventoryService {
    inventoryModel;
    historyModel;
    productModel;
    constructor(inventoryModel, historyModel, productModel) {
        this.inventoryModel = inventoryModel;
        this.historyModel = historyModel;
        this.productModel = productModel;
    }
    async create(createInventoryDto, session = null) {
        const existing = await this.inventoryModel
            .findOne({
            $or: [
                { productId: new mongoose_2.Types.ObjectId(createInventoryDto.productId) },
                { sku: createInventoryDto.sku.toLowerCase() },
            ],
        })
            .session(session);
        if (existing) {
            throw new common_1.ConflictException('Inventory or SKU already exists');
        }
        const normalizedSku = createInventoryDto.sku.toLowerCase();
        const inventory = new this.inventoryModel({
            ...createInventoryDto,
            productId: new mongoose_2.Types.ObjectId(createInventoryDto.productId),
            sku: normalizedSku,
        });
        const savedInventory = await inventory.save({ session: session });
        const history = new this.historyModel({
            productId: savedInventory.productId,
            inventoryId: savedInventory._id,
            sku: savedInventory.sku,
            quantity: savedInventory.stockQuantity,
            quantityBefore: 0,
            quantityAfter: savedInventory.stockQuantity,
            type: inventory_history_schema_1.InventoryTransactionType.INITIAL,
            reason: 'Initial stock setup',
        });
        await history.save({ session: session });
        await this.productModel.updateOne({ _id: savedInventory.productId }, {
            $set: {
                stock: savedInventory.stockQuantity,
                isInStock: savedInventory.stockQuantity > 0,
                lastStockSyncAt: new Date(),
            },
        }, { session: session });
        return savedInventory;
    }
    async findByProductId(productId) {
        const inventory = await this.inventoryModel.findOne({
            productId: new mongoose_2.Types.ObjectId(productId),
        });
        if (!inventory) {
            throw new common_1.NotFoundException(`Inventory for product ${productId} not found`);
        }
        return inventory;
    }
    async adjustStock(productId, adjustStockDto, session = null) {
        const { quantity, type, variantSku, referenceId, reason, note } = adjustStockDto;
        const inventory = await this.inventoryModel
            .findOne({ productId: new mongoose_2.Types.ObjectId(productId) })
            .session(session);
        if (!inventory) {
            throw new common_1.NotFoundException(`Inventory for product ${productId} not found`);
        }
        let quantityBefore;
        let quantityAfter;
        if (variantSku) {
            const variantIdx = inventory.variantStock.findIndex((v) => v.variantSku === variantSku);
            if (variantIdx === -1) {
                throw new common_1.NotFoundException(`Variant SKU ${variantSku} not found in inventory`);
            }
            quantityBefore = inventory.variantStock[variantIdx].stockQuantity;
            quantityAfter = quantityBefore + quantity;
            if (quantityAfter < 0) {
                throw new common_1.BadRequestException('Insufficient stock for variant');
            }
            inventory.variantStock[variantIdx].stockQuantity = quantityAfter;
        }
        else {
            quantityBefore = inventory.stockQuantity;
            quantityAfter = quantityBefore + quantity;
            if (quantityAfter < 0) {
                throw new common_1.BadRequestException('Insufficient stock for product');
            }
            inventory.stockQuantity = quantityAfter;
        }
        if (type === inventory_history_schema_1.InventoryTransactionType.SALE) {
            inventory.totalSold += Math.abs(quantity);
            inventory.lastSoldAt = new Date();
        }
        else if (type === inventory_history_schema_1.InventoryTransactionType.RESTOCK) {
            inventory.lastRestockedAt = new Date();
        }
        await inventory.save({ session: session });
        await this.productModel.updateOne({ _id: inventory.productId }, {
            $set: {
                stock: inventory.stockQuantity,
                isInStock: inventory.stockQuantity > 0,
                lastStockSyncAt: new Date(),
            },
        }, { session: session });
        const history = new this.historyModel({
            productId: inventory.productId,
            inventoryId: inventory._id,
            sku: inventory.sku,
            variantSku,
            quantity,
            quantityBefore,
            quantityAfter,
            type,
            referenceId,
            reason,
            note,
        });
        await history.save({ session: session });
        return inventory;
    }
    async getHistory(productId) {
        return this.historyModel
            .find({ productId: new mongoose_2.Types.ObjectId(productId) })
            .sort({ createdAt: -1 });
    }
    async update(productId, updateInventoryDto) {
        const inventory = await this.inventoryModel.findOneAndUpdate({ productId: new mongoose_2.Types.ObjectId(productId) }, { $set: updateInventoryDto }, { new: true });
        if (!inventory) {
            throw new common_1.NotFoundException(`Inventory for product ${productId} not found`);
        }
        return inventory;
    }
    async handleAdjustStock(payload) {
        return this.adjustStock(payload.productId, {
            quantity: payload.quantity,
            type: payload.type,
            variantSku: payload.variantSku,
            referenceId: payload.referenceId,
            reason: payload.reason,
        }, payload.session);
    }
};
exports.InventoryService = InventoryService;
__decorate([
    (0, event_emitter_1.OnEvent)(inventory_events_1.InventoryEvents.ADJUST_STOCK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inventory_events_1.InventoryAdjustEvent]),
    __metadata("design:returntype", Promise)
], InventoryService.prototype, "handleAdjustStock", null);
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(inventory_schema_1.ProductInventory.name)),
    __param(1, (0, mongoose_1.InjectModel)(inventory_history_schema_1.ProductInventoryHistory.name)),
    __param(2, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map