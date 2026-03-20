import { ProductAvailabilityResult, ProductCheckAvailabilityEvent } from '../../../common/events/product.events';
import { ProductService } from './product.service';
export declare class ProductEventsController {
    private readonly productService;
    constructor(productService: ProductService);
    handleCheckAvailability(payload: ProductCheckAvailabilityEvent): Promise<ProductAvailabilityResult>;
}
