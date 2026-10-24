import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { CouponModule } from './coupon/coupon.module';
import { DeliveryConfigModule } from './delivery/delivery-config.module';
import { IssueModule } from './issue/issue.module';
import { OrderModule } from './order/order.module';
import { RefundModule } from './refund/refund.module';

@Module({
  imports: [
    OrderModule,
    CartModule,
    CouponModule,
    RefundModule,
    IssueModule,
    DeliveryConfigModule,
  ],
  exports: [
    OrderModule,
    CartModule,
    CouponModule,
    RefundModule,
    IssueModule,
    DeliveryConfigModule,
  ],
})
export class OrderServiceModule {}
