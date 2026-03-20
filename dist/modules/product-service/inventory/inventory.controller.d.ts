import { AdjustStockDto, CreateInventoryDto, UpdateInventoryDto } from './dto/inventory.dto';
import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(createInventoryDto: CreateInventoryDto): Promise<import("./schemas/inventory.schema").ProductInventoryDocument>;
    findByProductId(productId: string): Promise<import("./schemas/inventory.schema").ProductInventoryDocument>;
    update(productId: string, updateInventoryDto: UpdateInventoryDto): Promise<import("./schemas/inventory.schema").ProductInventoryDocument>;
    adjustStock(productId: string, adjustStockDto: AdjustStockDto): Promise<import("./schemas/inventory.schema").ProductInventoryDocument>;
    getHistory(productId: string): Promise<import("./schemas/inventory-history.schema").ProductInventoryHistoryDocument[]>;
}
