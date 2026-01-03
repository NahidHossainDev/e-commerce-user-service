import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/interface';
import { PaymentQueryOptions } from '../dto/payment.query-options.dto';
import { UpdatePaymentStatusDto } from '../dto/update-payment-status.dto';
import { PaymentService } from '../payment.service';

@ApiTags('Admin Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/payments')
export class AdminPaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get payment statistics' })
  getStats() {
    return this.paymentService.getPaymentStats();
  }

  @Get()
  @ApiOperation({ summary: 'Find all payments' })
  findAll(@Query() query: PaymentQueryOptions) {
    return this.paymentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one payment by ID' })
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Patch('status/:id')
  @ApiOperation({ summary: 'Manually update payment status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePaymentStatusDto) {
    return this.paymentService.manualUpdateStatus(id, dto);
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Initiate refund' })
  initiateRefund(
    @Param('id') id: string,
    @Body() body: { amount: number; reason: string },
  ) {
    return this.paymentService.initiateRefund(id, body.amount, body.reason);
  }
}
