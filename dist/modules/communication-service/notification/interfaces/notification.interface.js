"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTIFICATION_CHANNEL_HANDLERS = exports.NotificationChannel = exports.NotificationCategory = exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    NotificationType["TRANSACTIONAL"] = "TRANSACTIONAL";
    NotificationType["MARKETING"] = "MARKETING";
    NotificationType["SYSTEM"] = "SYSTEM";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationCategory;
(function (NotificationCategory) {
    NotificationCategory["ORDER_PLACED"] = "ORDER_PLACED";
    NotificationCategory["PAYMENT_SUCCESS"] = "PAYMENT_SUCCESS";
    NotificationCategory["ORDER_CONFIRMED"] = "ORDER_CONFIRMED";
    NotificationCategory["ORDER_CANCELLED"] = "ORDER_CANCELLED";
    NotificationCategory["ORDER_SHIPPED"] = "ORDER_SHIPPED";
    NotificationCategory["ORDER_DELIVERED"] = "ORDER_DELIVERED";
    NotificationCategory["REFUND_PROCESSED"] = "REFUND_PROCESSED";
    NotificationCategory["MARKETING"] = "MARKETING";
    NotificationCategory["ACCOUNT_WELCOME"] = "ACCOUNT_WELCOME";
    NotificationCategory["ACCOUNT_SECURITY"] = "ACCOUNT_SECURITY";
    NotificationCategory["SYSTEM_ALERT"] = "SYSTEM_ALERT";
})(NotificationCategory || (exports.NotificationCategory = NotificationCategory = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["IN_APP"] = "IN_APP";
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["PUSH"] = "PUSH";
    NotificationChannel["SMS"] = "SMS";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
exports.NOTIFICATION_CHANNEL_HANDLERS = 'NOTIFICATION_CHANNEL_HANDLERS';
//# sourceMappingURL=notification.interface.js.map