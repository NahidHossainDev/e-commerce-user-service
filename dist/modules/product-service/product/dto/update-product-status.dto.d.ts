import { ProductStatus } from '../schemas/product.schema';
export declare class UpdateProductStatusDto {
    status: ProductStatus;
}
export declare class BulkUpdateStatusDto extends UpdateProductStatusDto {
    ids: string[];
}
