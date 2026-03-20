"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlug = void 0;
const createSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};
exports.createSlug = createSlug;
//# sourceMappingURL=slug.helper.js.map