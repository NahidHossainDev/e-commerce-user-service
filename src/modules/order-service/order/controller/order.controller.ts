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
import { UserDocument } from 'src/modules/user-service/user/user.schema';
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
  checkout(@CurrentUser() user: UserDocument, @Body() dto: CheckoutDto) {
    return this.orderService.checkout(user._id?.toString(), dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders for the current user' })
  findAll(
    @CurrentUser() user: UserDocument,
    @Query() query: OrderQueryOptions,
  ) {
    return this.orderService.findAllByUser(user._id?.toString(), query);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get order details by order ID' })
  findOne(
    @CurrentUser() user: UserDocument,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.getOrderByOrderId(user._id?.toString(), orderId);
  }

  @Post('apply-coupon')
  @ApiOperation({ summary: 'Apply a coupon and preview billing' })
  applyCoupon(@CurrentUser() user: UserDocument, @Body() dto: ApplyCouponDto) {
    return this.orderService.applyCoupon(user._id?.toString(), dto);
  }

  @Post('remove-coupon')
  @ApiOperation({ summary: 'Remove applied coupon and preview billing' })
  removeCoupon(@CurrentUser() user: UserDocument) {
    return this.orderService.removeCoupon(user._id?.toString());
  }
}
