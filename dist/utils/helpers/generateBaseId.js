"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBaseId = generateBaseId;
exports.isValidId = isValidId;
const uuid_1 = require("uuid");
function generateBaseId() {
    return (0, uuid_1.v7)();
}
function isValidId(id) {
    return (0, uuid_1.validate)(id);
}
//# sourceMappingURL=generateBaseId.js.map