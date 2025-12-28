import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../order/schemas/order.schema';
import { AdminRefundController, RefundController } from './controller';
import { RefundService } from './refund.service';
import { Refund, RefundSchema } from './schemas/refund.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Refund.name, schema: RefundSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [RefundController, AdminRefundController],
  providers: [RefundService],
  exports: [RefundService],
})
export class RefundModule {}
