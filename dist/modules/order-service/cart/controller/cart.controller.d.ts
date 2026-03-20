import { IAuthUser } from 'src/common/interface';
import { CartService } from '../cart.service';
import { AddToCartDto, CheckoutPreviewDto, UpdateCartItemDto } from '../dto/cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(user: IAuthUser): Promise<import("../schemas/cart.schema").CartDocument>;
    addToCart(user: IAuthUser, dto: AddToCartDto): Promise<import("../schemas/cart.schema").CartDocument>;
    updateItem(user: IAuthUser, itemId: string, dto: UpdateCartItemDto): Promise<import("../schemas/cart.schema").CartDocument>;
    removeItem(user: IAuthUser, itemId: string, variantSku?: string): Promise<import("../schemas/cart.schema").CartDocument>;
    checkoutPreview(user: IAuthUser, dto: CheckoutPreviewDto): Promise<import("../schemas/cart.schema").CartDocument>;
}
