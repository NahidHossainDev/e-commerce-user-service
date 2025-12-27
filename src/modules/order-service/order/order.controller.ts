import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckoutDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrderService } from './order.service';
// Assuming there's a JwtAuthGuard and User request interface from previous work
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Orders')
@Controller('orders')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Place an order' })
  checkout(@Req() req: any, @Body() dto: CheckoutDto) {
    const userId = req.user?.id || 'dummy-user-id';
    return this.orderService.checkout(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders for the current user' })
  findAll(@Req() req: any) {
    const userId = req.user?.id || 'dummy-user-id';
    return this.orderService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, dto);
  }
}
