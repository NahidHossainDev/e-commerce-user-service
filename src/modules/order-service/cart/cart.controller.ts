import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/cart.dto';

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

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(
    @Req() req: any,
    @Param('productId') productId: string,
    @Query('variantSku') variantSku?: string,
  ) {
    const userId = req.user?.id || 'dummy-user-id';
    return this.cartService.removeItem(userId, productId, variantSku);
  }
}
