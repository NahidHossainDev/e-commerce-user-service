import { CartService } from '../cart.service';
import { UpdateCartItemDto } from '../dto/cart.dto';
export declare class AdminCartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getUserCart(userId: string): Promise<import("../schemas/cart.schema").CartDocument>;
    clearUserCart(userId: string): Promise<void>;
    updateUserCartItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<import("../schemas/cart.schema").CartDocument>;
}
