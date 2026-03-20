"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const order_events_1 = require("../../../../common/events/order.events");
const payment_service_1 = require("../payment.service");
let PaymentListener = class PaymentListener {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async handlePaymentRequest(event) {
        await this.paymentService.paymentRequest(event);
    }
};
exports.PaymentListener = PaymentListener;
__decorate([
    (0, event_emitter_1.OnEvent)(order_events_1.OrderEvents.REQUEST_PAYMENT, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_events_1.OrderPaymentRequestEvent]),
    __metadata("design:returntype", Promise)
], PaymentListener.prototype, "handlePaymentRequest", null);
exports.PaymentListener = PaymentListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentListener);
//# sourceMappingURL=payment.listener.js.map