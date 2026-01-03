import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IAuthUser } from 'src/common/interface';
import { TopUpRequestDto, WalletTransactionQueryDto } from './dto/wallet.dto';
import { WalletService } from './wallet.service';

@ApiTags('Wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: 'Get wallet balance summary' })
  @Get('summary')
  async getSummary(@CurrentUser() user: IAuthUser) {
    return await this.walletService.getWalletSummary(user.id);
  }

  @Post('top-up/request')
  async requestTopUp(
    @CurrentUser() user: IAuthUser,
    @Body() dto: TopUpRequestDto,
  ) {
    return await this.walletService.requestTopUp(user.id, dto);
  }

  @ApiOperation({ summary: 'Get wallet transaction history' })
  @Get('transactions')
  async getTransactions(
    @CurrentUser() user: IAuthUser,
    @Query() query: WalletTransactionQueryDto,
  ) {
    return await this.walletService.findAllTransactions(query, user.id);
  }
}
