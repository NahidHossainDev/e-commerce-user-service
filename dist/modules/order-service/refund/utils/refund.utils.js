"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefundId = generateRefundId;
const generateBaseId_1 = require("../../../../utils/helpers/generateBaseId");
function generateRefundId() {
    return `REF-${(0, generateBaseId_1.generateBaseId)()}`;
}
//# sourceMappingURL=refund.utils.js.map