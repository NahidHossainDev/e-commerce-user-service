"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderId = generateOrderId;
const generateBaseId_1 = require("../../../../utils/helpers/generateBaseId");
function generateOrderId() {
    return `ORD-${(0, generateBaseId_1.generateBaseId)()}`;
}
//# sourceMappingURL=order.utils.js.map