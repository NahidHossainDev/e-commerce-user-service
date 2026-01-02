import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard';
import { IAuthUser } from 'src/common/interface';
import { CartService } from '../cart.service';
import {
  AddToCartDto,
  CheckoutPreviewDto,
  UpdateCartItemDto,
} from '../dto/cart.dto';

@ApiTags('Cart')
@Controller('cart')
@ApiBearerAuth()
@UseGuards(OptionalJwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  getCart(@CurrentUser() user: IAuthUser) {
    return this.cartService.getCart(user.id);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  addToCart(@CurrentUser() user: IAuthUser, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(user.id, dto);
  }

  @Patch('update/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItem(
    @CurrentUser() user: IAuthUser,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(user.id, itemId, dto);
  }

  @Delete('remove/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(
    @CurrentUser() user: IAuthUser,
    @Param('itemId') itemId: string,
    @Query('variantSku') variantSku?: string,
  ) {
    return this.cartService.removeItem(user.id, itemId, variantSku);
  }

  @Post('checkout-preview')
  @ApiOperation({ summary: 'Preview checkout with final calculations' })
  checkoutPreview(
    @CurrentUser() user: IAuthUser,
    @Body() dto: CheckoutPreviewDto,
  ) {
    return this.cartService.checkoutPreview(user.id, dto);
  }
}
