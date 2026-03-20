"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryEvents = exports.InventoryAdjustEvent = exports.InventoryTransactionType = void 0;
var InventoryTransactionType;
(function (InventoryTransactionType) {
    InventoryTransactionType["INITIAL"] = "INITIAL";
    InventoryTransactionType["RESTOCK"] = "RESTOCK";
    InventoryTransactionType["SALE"] = "SALE";
    InventoryTransactionType["RETURN"] = "RETURN";
    InventoryTransactionType["ADJUSTMENT"] = "ADJUSTMENT";
    InventoryTransactionType["TRANSFER"] = "TRANSFER";
    InventoryTransactionType["DAMAGED"] = "DAMAGED";
    InventoryTransactionType["EXPIRED"] = "EXPIRED";
})(InventoryTransactionType || (exports.InventoryTransactionType = InventoryTransactionType = {}));
class InventoryAdjustEvent {
    productId;
    quantity;
    type;
    variantSku;
    referenceId;
    reason;
    session;
    constructor(params) {
        this.productId = params.productId;
        this.quantity = params.quantity;
        this.type = params.type;
        this.variantSku = params.variantSku;
        this.referenceId = params.referenceId;
        this.reason = params.reason;
        this.session = params.session;
    }
}
exports.InventoryAdjustEvent = InventoryAdjustEvent;
exports.InventoryEvents = {
    ADJUST_STOCK: 'inventory.adjust-stock',
};
//# sourceMappingURL=inventory.events.js.map