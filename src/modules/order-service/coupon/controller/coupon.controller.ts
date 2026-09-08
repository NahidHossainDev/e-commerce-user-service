import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt-auth.guard';
import { IAuthUser } from 'src/common/interface';
import { CouponService } from '../coupon.service';
import {
  CouponValidationDto,
  GetAvailableCouponsQueryDto,
} from '../dto/coupon.dto';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get applicable and available coupons for guest or logged-in users',
  })
  @UseGuards(OptionalJwtAuthGuard)
  getAvailableCoupons(
    @CurrentUser() user: IAuthUser,
    @Query() query: GetAvailableCouponsQueryDto,
    @Req() req: any,
  ) {
    const userId =
      user?.id || (user as any)?._id?.toString() || req?.user?._id?.toString();
    return this.couponService.getAvailableCoupons(userId, query?.orderAmount);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a coupon code against user and cart amount' })
  @UseGuards(OptionalJwtAuthGuard)
  validateCoupon(
    @Body() body: CouponValidationDto,
    @CurrentUser() user: IAuthUser,
    @Req() req: any,
  ) {
    const userId =
      user?.id || (user as any)?._id?.toString() || req?.user?._id?.toString();
    if (userId) {
      body.userId = userId;
    }
    return this.couponService.validateCoupon(body);
  }
}


