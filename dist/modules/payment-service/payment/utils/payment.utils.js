"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionId = generateTransactionId;
const generateBaseId_1 = require("../../../../utils/helpers/generateBaseId");
function generateTransactionId() {
    return `TNX-${(0, generateBaseId_1.generateBaseId)()}`;
}
//# sourceMappingURL=payment.utils.js.map