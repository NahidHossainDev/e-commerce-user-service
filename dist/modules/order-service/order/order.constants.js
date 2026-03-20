"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderFilterableFields = exports.orderSearchableFields = void 0;
exports.orderSearchableFields = [
    'orderId',
    'billingInfo.paymentTransactionId',
];
exports.orderFilterableFields = [
    'status',
    'billingInfo.paymentStatus',
    'userId',
    'addressId',
];
//# sourceMappingURL=order.constants.js.map