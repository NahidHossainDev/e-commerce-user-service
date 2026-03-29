"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = void 0;
const pick = (obj, keys) => {
    const finalObj = {};
    for (const key of keys) {
        if (obj && obj[key] !== undefined) {
            finalObj[key] = obj[key];
        }
    }
    return finalObj;
};
exports.pick = pick;
//# sourceMappingURL=pick.js.map