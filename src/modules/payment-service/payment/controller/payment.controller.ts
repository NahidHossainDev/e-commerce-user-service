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
import { InitiatePaymentDto } from '../dto/initiate-payment.dto';
import { PaymentQueryOptions } from '../dto/payment.query-options.dto';
import { PaymentService } from '../payment.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Initiate a payment' })
  initiate(@CurrentUser() user: IAuthUser, @Body() dto: InitiatePaymentDto) {
    if (dto.userId !== user.id) {
      // Ideally specific logic or check if necessary, though typical initiate implies for self.
      // For now, override userId with authenticated user to enforce security
      dto.userId = user.id;
    }
    return this.paymentService.initiatePayment(dto);
  }

  @Post('sslcommerz/callback')
  @ApiOperation({ summary: 'SSLCommerz Callback URL (Public)' })
  handleSSLCommerzCallback(@Body() payload: any) {
    return this.paymentService.handleSSLCommerzCallback(payload);
  }

  @Get('my-payments')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user payments' })
  getMyPayments(
    @CurrentUser() user: IAuthUser,
    @Query() query: PaymentQueryOptions,
  ) {
    return this.paymentService.getMyPayments(user.id, query);
  }

  @Post('verify/:transactionId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Verify payment status manually' })
  verifyPayment(@Param('transactionId') transactionId: string) {
    return this.paymentService.verifyPayment(transactionId);
  }

  @Get(':transactionId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get payment by transaction ID' })
  getPayment(
    @CurrentUser() user: IAuthUser,
    @Param('transactionId') transactionId: string,
  ) {
    return this.paymentService.getPaymentByTransactionId(
      transactionId,
      user.id,
    );
  }

  @Get('available-payment-methods')
  @ApiOperation({ summary: 'Get available payment methods' })
  getAvailablePaymentMethods() {
    return this.paymentService.getAvailablePaymentMethods();
  }
}
