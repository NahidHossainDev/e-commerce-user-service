"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletStatus = exports.WalletBalanceType = exports.WalletTransactionSource = exports.WalletTransactionType = void 0;
var WalletTransactionType;
(function (WalletTransactionType) {
    WalletTransactionType["CREDIT"] = "CREDIT";
    WalletTransactionType["DEBIT"] = "DEBIT";
})(WalletTransactionType || (exports.WalletTransactionType = WalletTransactionType = {}));
var WalletTransactionSource;
(function (WalletTransactionSource) {
    WalletTransactionSource["ADD_MONEY"] = "ADD_MONEY";
    WalletTransactionSource["ORDER_PAYMENT"] = "ORDER_PAYMENT";
    WalletTransactionSource["CASHBACK"] = "CASHBACK";
    WalletTransactionSource["REFUND"] = "REFUND";
    WalletTransactionSource["WITHDRAWAL"] = "WITHDRAWAL";
    WalletTransactionSource["ADMIN_ADJUSTMENT"] = "ADMIN_ADJUSTMENT";
})(WalletTransactionSource || (exports.WalletTransactionSource = WalletTransactionSource = {}));
var WalletBalanceType;
(function (WalletBalanceType) {
    WalletBalanceType["DEPOSIT"] = "DEPOSIT";
    WalletBalanceType["CASHBACK"] = "CASHBACK";
})(WalletBalanceType || (exports.WalletBalanceType = WalletBalanceType = {}));
var WalletStatus;
(function (WalletStatus) {
    WalletStatus["ACTIVE"] = "ACTIVE";
    WalletStatus["INACTIVE"] = "INACTIVE";
    WalletStatus["LOCKED"] = "LOCKED";
})(WalletStatus || (exports.WalletStatus = WalletStatus = {}));
//# sourceMappingURL=wallet.interface.js.map