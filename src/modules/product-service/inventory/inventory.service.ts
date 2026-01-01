import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import {
  InventoryAdjustEvent,
  InventoryEvents,
} from 'src/common/events/inventory.events';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import {
  AdjustStockDto,
  CreateInventoryDto,
  UpdateInventoryDto,
} from './dto/inventory.dto';
import {
  InventoryTransactionType,
  ProductInventoryHistory,
  ProductInventoryHistoryDocument,
} from './schemas/inventory-history.schema';
import {
  ProductInventory,
  ProductInventoryDocument,
} from './schemas/inventory.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(ProductInventory.name)
    private inventoryModel: Model<ProductInventoryDocument>,
    @InjectModel(ProductInventoryHistory.name)
    private historyModel: Model<ProductInventoryHistoryDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async create(
    createInventoryDto: CreateInventoryDto,
    session: ClientSession | null = null,
  ): Promise<ProductInventoryDocument> {
    const existing = await this.inventoryModel
      .findOne({
        $or: [
          { productId: new Types.ObjectId(createInventoryDto.productId) },
          { sku: createInventoryDto.sku.toLowerCase() },
        ],
      })
      .session(session);

    if (existing) {
      throw new ConflictException('Inventory or SKU already exists');
    }

    const normalizedSku = createInventoryDto.sku.toLowerCase();
    const inventory = new this.inventoryModel({
      ...createInventoryDto,
      productId: new Types.ObjectId(createInventoryDto.productId),
      sku: normalizedSku,
    });

    const savedInventory = await inventory.save({ session: session as any });

    // Initial History Record
    const history = new this.historyModel({
      productId: savedInventory.productId,
      inventoryId: savedInventory._id,
      sku: savedInventory.sku,
      quantity: savedInventory.stockQuantity,
      quantityBefore: 0,
      quantityAfter: savedInventory.stockQuantity,
      type: InventoryTransactionType.INITIAL,
      reason: 'Initial stock setup',
    });
    await history.save({ session: session as any });

    // Sync with Product Collection
    await this.productModel.updateOne(
      { _id: savedInventory.productId },
      {
        $set: {
          stock: savedInventory.stockQuantity,
          isInStock: savedInventory.stockQuantity > 0,
          lastStockSyncAt: new Date(),
        },
      },
      { session: session as any },
    );

    return savedInventory;
  }

  async findByProductId(productId: string): Promise<ProductInventoryDocument> {
    const inventory = await this.inventoryModel.findOne({
      productId: new Types.ObjectId(productId),
    });
    if (!inventory) {
      throw new NotFoundException(
        `Inventory for product ${productId} not found`,
      );
    }
    return inventory;
  }

  async adjustStock(
    productId: string,
    adjustStockDto: AdjustStockDto,
    session: ClientSession | null = null,
  ): Promise<ProductInventoryDocument> {
    const { quantity, type, variantSku, referenceId, reason, note } =
      adjustStockDto;

    const inventory = await this.inventoryModel
      .findOne({ productId: new Types.ObjectId(productId) })
      .session(session);
    if (!inventory) {
      throw new NotFoundException(
        `Inventory for product ${productId} not found`,
      );
    }

    let quantityBefore: number;
    let quantityAfter: number;

    if (variantSku) {
      const variantIdx = inventory.variantStock.findIndex(
        (v) => v.variantSku === variantSku,
      );
      if (variantIdx === -1) {
        throw new NotFoundException(
          `Variant SKU ${variantSku} not found in inventory`,
        );
      }

      quantityBefore = inventory.variantStock[variantIdx].stockQuantity;
      quantityAfter = quantityBefore + quantity;

      if (quantityAfter < 0) {
        throw new BadRequestException('Insufficient stock for variant');
      }

      inventory.variantStock[variantIdx].stockQuantity = quantityAfter;
    } else {
      quantityBefore = inventory.stockQuantity;
      quantityAfter = quantityBefore + quantity;

      if (quantityAfter < 0) {
        throw new BadRequestException('Insufficient stock for product');
      }

      inventory.stockQuantity = quantityAfter;
    }

    if (type === InventoryTransactionType.SALE) {
      inventory.totalSold += Math.abs(quantity);
      inventory.lastSoldAt = new Date();
    } else if (type === InventoryTransactionType.RESTOCK) {
      inventory.lastRestockedAt = new Date();
    }

    await inventory.save({ session: session as any });

    // Sync with Product Collection
    await this.productModel.updateOne(
      { _id: inventory.productId },
      {
        $set: {
          stock: inventory.stockQuantity,
          isInStock: inventory.stockQuantity > 0,
          lastStockSyncAt: new Date(),
        },
      },
      { session: session as any },
    );

    // Log history
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
    await history.save({ session: session as any });

    return inventory;
  }

  async getHistory(
    productId: string,
  ): Promise<ProductInventoryHistoryDocument[]> {
    return this.historyModel
      .find({ productId: new Types.ObjectId(productId) })
      .sort({ createdAt: -1 });
  }

  async update(
    productId: string,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<ProductInventoryDocument> {
    const inventory = await this.inventoryModel.findOneAndUpdate(
      { productId: new Types.ObjectId(productId) },
      { $set: updateInventoryDto },
      { new: true },
    );

    if (!inventory) {
      throw new NotFoundException(
        `Inventory for product ${productId} not found`,
      );
    }
    return inventory;
  }

  @OnEvent(InventoryEvents.ADJUST_STOCK)
  async handleAdjustStock(payload: InventoryAdjustEvent) {
    return this.adjustStock(
      payload.productId,
      {
        quantity: payload.quantity,
        type: payload.type as any,
        variantSku: payload.variantSku,
        referenceId: payload.referenceId,
        reason: payload.reason,
      },
      payload.session,
    );
  }
}
