import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from '../cart.service';
import {
  AddToCartDto,
  ApplyCouponDto,
  CheckoutPreviewDto,
  UpdateCartItemDto,
} from '../dto/cart.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  getCart(@Req() req: any) {
    const userId = req.user?.id || 'dummy-user-id';
    return this.cartService.getCart(userId);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  addToCart(@Req() req: any, @Body() dto: AddToCartDto) {
    const userId = req.user?.id || 'dummy-user-id';
    return this.cartService.addToCart(userId, dto);
  }

  @Patch('update/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItem(
    @Req() req: any,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const userId = req.user?.id || 'dummy-user-id';
    // itemId acts as productId here
    return this.cartService.updateItemQuantity(userId, itemId, dto);
  }

  @Delete('remove/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(
    @Req() req: any,
    @Param('itemId') itemId: string,
    @Query('variantSku') variantSku?: string,
  ) {
    const userId = req.user?.id || 'dummy-user-id';
    return this.cartService.removeItem(userId, itemId, variantSku);
  }

  @Post('apply-coupon')
  @ApiOperation({ summary: 'Apply a coupon to the cart' })
  applyCoupon(@Req() req: any, @Body() dto: ApplyCouponDto) {
    const userId = req.user?.id || 'dummy-user-id';
    return this.cartService.applyCoupon(userId, dto);
  }

  @Delete('remove-coupon')
  @ApiOperation({ summary: 'Remove applied coupon from cart' })
  removeCoupon(@Req() req: any) {
    const userId = req.user?.id || 'dummy-user-id';
    return this.cartService.removeCoupon(userId);
  }

  @Post('checkout-preview')
  @ApiOperation({ summary: 'Preview checkout with final calculations' })
  checkoutPreview(@Req() req: any, @Body() dto: CheckoutPreviewDto) {
    const userId = req.user?.id || 'dummy-user-id';
    return this.cartService.checkoutPreview(userId, dto);
  }
}
