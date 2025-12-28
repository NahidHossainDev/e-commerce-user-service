import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponModule } from '../coupon/coupon.module';
import { CartService } from './cart.service';
import { AdminCartController } from './controller/admin-cart.controller';
import { CartController } from './controller/cart.controller';
import { Cart, CartSchema } from './schemas/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    CouponModule,
  ],
  controllers: [CartController, AdminCartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
