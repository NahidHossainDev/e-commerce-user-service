import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IAuthUser } from 'src/common/interface';
import { ApplyCouponDto, CheckoutDto } from '../dto/order.dto';
import { OrderQueryOptions } from '../dto/order.query-options.dto';
import { OrderService } from '../order.service';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Place an order' })
  checkout(@CurrentUser() user: IAuthUser, @Body() dto: CheckoutDto) {
    return this.orderService.checkout(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders for the current user' })
  findAll(@CurrentUser() user: IAuthUser, @Query() query: OrderQueryOptions) {
    return this.orderService.findAllByUser(user.id, query);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get order details by order ID' })
  findOne(@CurrentUser() user: IAuthUser, @Param('orderId') orderId: string) {
    return this.orderService.getOrderByOrderId(user.id, orderId);
  }

  @Post('apply-coupon')
  @ApiOperation({ summary: 'Apply a coupon and preview billing' })
  applyCoupon(@CurrentUser() user: IAuthUser, @Body() dto: ApplyCouponDto) {
    return this.orderService.applyCoupon(user.id, dto);
  }

  @Post('remove-coupon')
  @ApiOperation({ summary: 'Remove applied coupon and preview billing' })
  removeCoupon(@CurrentUser() user: IAuthUser) {
    return this.orderService.removeCoupon(user.id);
  }
}
