"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderPaymentRequestEvent = exports.OrderEvents = void 0;
var OrderEvents;
(function (OrderEvents) {
    OrderEvents["ORDER_CREATED"] = "order.created";
    OrderEvents["ORDER_CANCELLED"] = "order.cancelled";
    OrderEvents["ORDER_SHIPPED"] = "order.shipped";
    OrderEvents["ORDER_DELIVERED"] = "order.delivered";
    OrderEvents["ORDER_STATUS_UPDATED"] = "order.status_updated";
    OrderEvents["REQUEST_PAYMENT"] = "order.request_payment";
})(OrderEvents || (exports.OrderEvents = OrderEvents = {}));
class OrderPaymentRequestEvent {
    payload;
    constructor(payload) {
        this.payload = payload;
    }
}
exports.OrderPaymentRequestEvent = OrderPaymentRequestEvent;
//# sourceMappingURL=order.events.js.map