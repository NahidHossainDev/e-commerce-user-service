import { ClientSession, Model } from 'mongoose';
import { InventoryAdjustEvent } from 'src/common/events/inventory.events';
import { ProductDocument } from '../product/schemas/product.schema';
import { AdjustStockDto, CreateInventoryDto, UpdateInventoryDto } from './dto/inventory.dto';
import { ProductInventoryHistoryDocument } from './schemas/inventory-history.schema';
import { ProductInventoryDocument } from './schemas/inventory.schema';
export declare class InventoryService {
    private inventoryModel;
    private historyModel;
    private productModel;
    constructor(inventoryModel: Model<ProductInventoryDocument>, historyModel: Model<ProductInventoryHistoryDocument>, productModel: Model<ProductDocument>);
    create(createInventoryDto: CreateInventoryDto, session?: ClientSession | null): Promise<ProductInventoryDocument>;
    findByProductId(productId: string): Promise<ProductInventoryDocument>;
    adjustStock(productId: string, adjustStockDto: AdjustStockDto, session?: ClientSession | null): Promise<ProductInventoryDocument>;
    getHistory(productId: string): Promise<ProductInventoryHistoryDocument[]>;
    update(productId: string, updateInventoryDto: UpdateInventoryDto): Promise<ProductInventoryDocument>;
    handleAdjustStock(payload: InventoryAdjustEvent): Promise<ProductInventoryDocument>;
}
