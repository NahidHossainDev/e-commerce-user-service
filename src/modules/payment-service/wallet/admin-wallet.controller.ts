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
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IAuthUser, UserRole } from 'src/common/interface';
import {
  AdminWalletQueryDto,
  BalanceAdjustmentDto,
  WalletTransactionQueryDto,
} from './dto/wallet.dto';
import { WalletService } from './wallet.service';

@ApiTags('Admin Wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/wallet')
export class AdminWalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: 'Get global wallet statistics' })
  @Get('summary')
  async getSummary() {
    return await this.walletService.getAdminWalletStats();
  }

  @ApiOperation({ summary: 'List all user wallets' })
  @Get()
  async findAll(@Query() query: AdminWalletQueryDto) {
    return await this.walletService.findAllWallets(query);
  }

  @ApiOperation({ summary: 'Get global transaction history' })
  @Get('transactions')
  async findAllTransactions(@Query() query: WalletTransactionQueryDto) {
    return await this.walletService.findAllTransactions(query);
  }

  @ApiOperation({ summary: 'Get specific user wallet details' })
  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return await this.walletService.getWalletSummary(userId);
  }

  @ApiOperation({ summary: 'Manually adjust user balance' })
  @Post(':userId/adjust')
  async adjustBalance(
    @Param('userId') userId: string,
    @Body() dto: BalanceAdjustmentDto,
    @CurrentUser() admin: IAuthUser,
  ) {
    return await this.walletService.adjustBalance(userId, dto, admin.id);
  }
}
