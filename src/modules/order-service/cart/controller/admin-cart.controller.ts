import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/modules/user-service/user/user.schema';
import { CartService } from '../cart.service';
import { UpdateCartItemDto } from '../dto/cart.dto';

@ApiTags('Admin-Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/carts')
export class AdminCartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user cart by admin' })
  getUserCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Clear user cart by admin' })
  clearUserCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }

  @Patch(':userId/items/:itemId')
  @ApiOperation({ summary: 'Update user cart item by admin' })
  updateUserCartItem(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(userId, itemId, dto);
  }
}
