import { ProductQueryDto } from './dto/product-query-options.dto';
import { PaginatedProductsResponseDto, ProductResponseDto } from './dto/product-response.dto';
import { ProductService } from './product.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    findAll(queryDto: ProductQueryDto): Promise<PaginatedProductsResponseDto>;
    findOne(idOrSlug: string): Promise<ProductResponseDto>;
}
