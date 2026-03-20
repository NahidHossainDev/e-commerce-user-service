"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_SORT_OPTIONS = exports.PRODUCT_SEARCH_FIELDS = exports.PRODUCT_FILTER_FIELDS = void 0;
exports.PRODUCT_FILTER_FIELDS = [
    'searchTerm',
    'status',
    'categoryId',
    'brandId',
    'isFeatured',
    'isBestSeller',
    'isOnOffer',
    'isNew',
    'isPerishable',
    'vendorId',
    'minPrice',
    'maxPrice',
];
exports.PRODUCT_SEARCH_FIELDS = [
    'title',
    'slug',
    'sku',
    'barcode',
    'tags',
    'keywords',
];
exports.PRODUCT_SORT_OPTIONS = {
    NEWEST: { createdAt: -1 },
    OLDEST: { createdAt: 1 },
    PRICE_LOW_HIGH: { 'price.basePrice': 1 },
    PRICE_HIGH_LOW: { 'price.basePrice': -1 },
    RATING_HIGH_LOW: { averageRating: -1 },
    SALES_HIGH_LOW: { salesCount: -1 },
    TITLE_ASC: { title: 1 },
    TITLE_DESC: { title: -1 },
};
//# sourceMappingURL=product.constants.js.map