import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/interface';
import { UpdateOrderStatusDto, UpdatePaymentStatusDto } from '../dto/order.dto';
import { OrderQueryOptions } from '../dto/order.query-options.dto';
import { OrderService } from '../order.service';

@ApiTags('Admin Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/orders')
export class AdminOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get order overview statistics' })
  getStats() {
    return this.orderService.getStats();
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders with optional filters' })
  findAll(@Query() query: OrderQueryOptions) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by system ID' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch('status/:id')
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, dto);
  }

  @Patch('payment-status/:id')
  @ApiOperation({ summary: 'Update order payment status' })
  updatePaymentStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentStatusDto,
  ) {
    return this.orderService.updatePaymentStatus(id, dto);
  }
}
