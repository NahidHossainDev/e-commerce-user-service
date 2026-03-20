"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundInitiatedEvent = exports.PaymentFailedEvent = exports.PaymentCompletedEvent = exports.PaymentEvents = void 0;
var PaymentEvents;
(function (PaymentEvents) {
    PaymentEvents["PAYMENT_COMPLETED"] = "payment.completed";
    PaymentEvents["PAYMENT_FAILED"] = "payment.failed";
    PaymentEvents["REFUND_INITIATED"] = "payment.refund.initiated";
})(PaymentEvents || (exports.PaymentEvents = PaymentEvents = {}));
class PaymentCompletedEvent {
    paymentId;
    transactionId;
    orderId;
    userId;
    amount;
    method;
    paidAt;
    constructor(paymentId, transactionId, orderId, userId, amount, method, paidAt) {
        this.paymentId = paymentId;
        this.transactionId = transactionId;
        this.orderId = orderId;
        this.userId = userId;
        this.amount = amount;
        this.method = method;
        this.paidAt = paidAt;
    }
}
exports.PaymentCompletedEvent = PaymentCompletedEvent;
class PaymentFailedEvent {
    paymentId;
    transactionId;
    orderId;
    userId;
    reason;
    constructor(paymentId, transactionId, orderId, userId, reason) {
        this.paymentId = paymentId;
        this.transactionId = transactionId;
        this.orderId = orderId;
        this.userId = userId;
        this.reason = reason;
    }
}
exports.PaymentFailedEvent = PaymentFailedEvent;
class RefundInitiatedEvent {
    paymentId;
    transactionId;
    orderId;
    amount;
    reason;
    constructor(paymentId, transactionId, orderId, amount, reason) {
        this.paymentId = paymentId;
        this.transactionId = transactionId;
        this.orderId = orderId;
        this.amount = amount;
        this.reason = reason;
    }
}
exports.RefundInitiatedEvent = RefundInitiatedEvent;
//# sourceMappingURL=payment.events.js.map