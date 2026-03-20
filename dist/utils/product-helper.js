"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidObjectId = exports.generateSKU = exports.calculateDiscountedPrice = exports.generateSlug = void 0;
const mongoose_1 = require("mongoose");
const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};
exports.generateSlug = generateSlug;
const calculateDiscountedPrice = (basePrice, discountRate) => {
    if (!discountRate || discountRate <= 0)
        return basePrice;
    const discountAmount = (basePrice * discountRate) / 100;
    return Number((basePrice - discountAmount).toFixed(2));
};
exports.calculateDiscountedPrice = calculateDiscountedPrice;
const generateSKU = (brandName, categoryName, suffix) => {
    const brandPfx = brandName.substring(0, 3).toUpperCase();
    const catPfx = categoryName.substring(0, 3).toUpperCase();
    const randomSuffix = suffix || Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${brandPfx}-${catPfx}-${randomSuffix}`.toLowerCase();
};
exports.generateSKU = generateSKU;
const isValidObjectId = (id) => {
    return mongoose_1.Types.ObjectId.isValid(id);
};
exports.isValidObjectId = isValidObjectId;
//# sourceMappingURL=product-helper.js.map