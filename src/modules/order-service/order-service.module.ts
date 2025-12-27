import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { CouponModule } from './coupon/coupon.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [OrderModule, CartModule, CouponModule],
  exports: [OrderModule, CartModule, CouponModule],
})
export class OrderServiceModule {}
