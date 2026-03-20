"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURRENCY_SYMBOLS = exports.DEFAULT_CURRENCY = exports.AppCurrency = void 0;
var AppCurrency;
(function (AppCurrency) {
    AppCurrency["USD"] = "USD";
    AppCurrency["BDT"] = "BDT";
    AppCurrency["EUR"] = "EUR";
    AppCurrency["GBP"] = "GBP";
})(AppCurrency || (exports.AppCurrency = AppCurrency = {}));
exports.DEFAULT_CURRENCY = AppCurrency.BDT;
exports.CURRENCY_SYMBOLS = {
    [AppCurrency.USD]: '$',
    [AppCurrency.BDT]: '৳',
    [AppCurrency.EUR]: '€',
    [AppCurrency.GBP]: '£',
};
//# sourceMappingURL=currency.constants.js.map