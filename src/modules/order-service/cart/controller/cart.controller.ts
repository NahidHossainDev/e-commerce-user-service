import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
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
  MergeCartRequestDto,
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
    if (!user?.id) {
      throw new UnauthorizedException('Authentication required');
    }
    return this.cartService.getCart(user.id);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  addToCart(@CurrentUser() user: IAuthUser, @Body() dto: AddToCartDto) {
    if (!user?.id) {
      throw new UnauthorizedException('Authentication required');
    }
    return this.cartService.addToCart(user.id, dto);
  }

  @Post('merge')
  @ApiOperation({ summary: 'Merge guest cart with user cart' })
  mergeCart(@CurrentUser() user: IAuthUser, @Body() dto: MergeCartRequestDto) {
    if (!user?.id) {
      throw new UnauthorizedException('Authentication required to merge cart');
    }
    return this.cartService.mergeCart(user.id, dto.items || []);
  }

  @Patch('update/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItem(
    @CurrentUser() user: IAuthUser,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    if (!user?.id) {
      throw new UnauthorizedException('Authentication required');
    }
    return this.cartService.updateItemQuantity(user.id, itemId, dto);
  }

  @Delete('remove/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(
    @CurrentUser() user: IAuthUser,
    @Param('itemId') itemId: string,
    @Query('variantSku') variantSku?: string,
  ) {
    if (!user?.id) {
      throw new UnauthorizedException('Authentication required');
    }
    return this.cartService.removeItem(user.id, itemId, variantSku);
  }

  @Post('checkout-preview')
  @ApiOperation({ summary: 'Preview checkout with final calculations' })
  checkoutPreview(
    @CurrentUser() user: IAuthUser,
    @Body() dto: CheckoutPreviewDto,
  ) {
    if (!user?.id) {
      throw new UnauthorizedException('Authentication required');
    }
    return this.cartService.checkoutPreview(user.id, dto);
  }
}
