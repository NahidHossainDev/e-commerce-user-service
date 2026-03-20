import { ProductQueryDto } from '../dto/product-query-options.dto';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { BulkUpdateStatusDto, UpdateProductStatusDto } from '../dto/update-product-status.dto';
import { ProductService } from '../product.service';
export declare class AdminProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto): Promise<import("../schemas/product.schema").ProductDocument>;
    findAll(queryDto: ProductQueryDto): Promise<import("../../../../common/interface").IPaginatedResponse<import("../schemas/product.schema").ProductDocument>>;
    findOne(id: string): Promise<import("../schemas/product.schema").ProductDocument>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("../schemas/product.schema").ProductDocument>;
    remove(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    updateStatus(id: string, dto: UpdateProductStatusDto): Promise<import("../schemas/product.schema").ProductDocument>;
    restore(id: string): Promise<import("../schemas/product.schema").ProductDocument>;
    bulkUpdateStatus(dto: BulkUpdateStatusDto): Promise<any>;
}
