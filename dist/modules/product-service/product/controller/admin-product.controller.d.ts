import { ProductQueryDto } from '../dto/product-query-options.dto';
import { PaginatedProductsResponseDto, ProductResponseDto } from '../dto/product-response.dto';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { BulkUpdateStatusDto, UpdateProductStatusDto } from '../dto/update-product-status.dto';
import { ProductService } from '../product.service';
export declare class AdminProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto): Promise<ProductResponseDto>;
    findAll(queryDto: ProductQueryDto): Promise<PaginatedProductsResponseDto>;
    findOne(id: string): Promise<ProductResponseDto>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto>;
    remove(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    updateStatus(id: string, dto: UpdateProductStatusDto): Promise<ProductResponseDto>;
    restore(id: string): Promise<ProductResponseDto>;
    bulkUpdateStatus(dto: BulkUpdateStatusDto): Promise<any>;
}
