"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductEvents = exports.ProductAvailabilityResult = exports.ProductCheckAvailabilityEvent = void 0;
class ProductCheckAvailabilityEvent {
    productId;
    quantity;
    variantSku;
    constructor(params) {
        this.productId = params.productId;
        this.quantity = params.quantity ?? 1;
        this.variantSku = params.variantSku;
    }
}
exports.ProductCheckAvailabilityEvent = ProductCheckAvailabilityEvent;
class ProductAvailabilityResult {
    productId;
    isAvailable;
    price;
    title;
    thumbnail;
    availableStock;
    error;
    variantSku;
    constructor(params) {
        this.productId = params.productId;
        this.isAvailable = params.isAvailable;
        this.price = params.price;
        this.title = params.title;
        this.thumbnail = params.thumbnail;
        this.availableStock = params.availableStock;
        this.error = params.error;
        this.variantSku = params.variantSku;
    }
}
exports.ProductAvailabilityResult = ProductAvailabilityResult;
exports.ProductEvents = {
    CHECK_AVAILABILITY: 'product.check-stock',
};
//# sourceMappingURL=product.events.js.map