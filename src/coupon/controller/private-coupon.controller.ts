import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';
import { CouponService } from '../coupon.service';
import { CouponValidationDto } from '../dto/coupon.dto';

@ApiTags('Private / Coupons')
@Controller('coupons')
export class PrivateCouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('validate')
  @UseGuards(OptionalJwtAuthGuard)
  validateCoupon(@Body() payload: CouponValidationDto, @Req() req) {
    if (req.user && req.user._id) {
      payload.userId = req.user._id.toString();
    }
    return this.couponService.validateCoupon(payload);
  }
}
