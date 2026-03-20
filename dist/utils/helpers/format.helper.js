"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCamelCase = void 0;
const formatCamelCase = (text) => {
    if (!text)
        return '';
    return text
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        .toLowerCase();
};
exports.formatCamelCase = formatCamelCase;
//# sourceMappingURL=format.helper.js.map