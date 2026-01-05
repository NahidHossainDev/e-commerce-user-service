import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OrderEvents,
  OrderPaymentRequestEvent,
} from 'src/common/events/order.events';
import { PaymentService } from '../payment.service';

@Injectable()
export class PaymentListener {
  constructor(private readonly paymentService: PaymentService) {}

  @OnEvent(OrderEvents.REQUEST_PAYMENT, { async: true })
  async handlePaymentRequest(event: OrderPaymentRequestEvent) {
    await this.paymentService.paymentRequest(event);
  }
}
