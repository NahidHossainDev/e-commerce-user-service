import { ProductQueryDto } from './dto/product-query-options.dto';
import { ProductService } from './product.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    findAll(queryDto: ProductQueryDto): Promise<import("../../../common/interface").IPaginatedResponse<import("./schemas/product.schema").ProductDocument>>;
    findOne(idOrSlug: string): Promise<import("./schemas/product.schema").ProductDocument>;
}
