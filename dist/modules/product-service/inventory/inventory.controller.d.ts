import { AdjustStockDto, CreateInventoryDto, UpdateInventoryDto } from './dto/inventory.dto';
import { ProductInventoryHistoryResponseDto, ProductInventoryResponseDto } from './dto/inventory-response.dto';
import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(createInventoryDto: CreateInventoryDto): Promise<ProductInventoryResponseDto>;
    findByProductId(productId: string): Promise<ProductInventoryResponseDto>;
    update(productId: string, updateInventoryDto: UpdateInventoryDto): Promise<ProductInventoryResponseDto>;
    adjustStock(productId: string, adjustStockDto: AdjustStockDto): Promise<ProductInventoryResponseDto>;
    getHistory(productId: string): Promise<ProductInventoryHistoryResponseDto[]>;
}
