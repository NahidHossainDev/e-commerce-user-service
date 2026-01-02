import {
  Body,
  Controller,
  Delete,
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
import { UserRole } from 'src/modules/user-service/user/user.schema';
import { CouponService } from '../coupon.service';
import { CreateCouponDto } from '../dto/coupon.dto';
import {
  CouponQueryOptions,
  CouponUsageQueryOptions,
} from '../dto/coupon.query-options.dto';

@ApiTags('Admin / Coupons')
@Controller('admin/coupons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminCouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new coupon (Admin)' })
  create(@Body() dto: CreateCouponDto) {
    return this.couponService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all coupons (Admin)' })
  findAll(@Query() query: CouponQueryOptions) {
    return this.couponService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.couponService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateCouponDto) {
    return this.couponService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.couponService.delete(id);
  }

  @Patch(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.couponService.toggle(id);
  }

  @Get('usage-history')
  getCouponUsageHistory(@Query() query: CouponUsageQueryOptions) {
    return this.couponService.getCouponUsageHistory(query);
  }
}
