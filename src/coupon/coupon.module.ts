import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminCouponController, PrivateCouponController } from './controller';
import { CouponService } from './coupon.service';
import { CouponUsage, CouponUsageSchema } from './schemas/coupon-usage.schema';
import { Coupon, CouponSchema } from './schemas/coupon.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coupon.name, schema: CouponSchema },
      { name: CouponUsage.name, schema: CouponUsageSchema },
    ]),
  ],
  controllers: [AdminCouponController, PrivateCouponController],
  providers: [CouponService],
  exports: [CouponService],
})
export class CouponModule {}
