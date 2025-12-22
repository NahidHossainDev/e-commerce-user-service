export const PRODUCT_FILTER_FIELDS = [
  'status',
  'category.id',
  'brand.id',
  'isFeatured',
  'isBestSeller',
  'isOnOffer',
  'isNew',
  'isPerishable',
  'vendorId',
];

export const PRODUCT_SEARCH_FIELDS = ['title', 'slug', 'sku', 'barcode', 'tags', 'keywords'];

export const PRODUCT_SORT_OPTIONS = {
  NEWEST: { createdAt: -1 },
  OLDEST: { createdAt: 1 },
  PRICE_LOW_HIGH: { 'price.basePrice': 1 },
  PRICE_HIGH_LOW: { 'price.basePrice': -1 },
  RATING_HIGH_LOW: { averageRating: -1 },
  SALES_HIGH_LOW: { salesCount: -1 },
  TITLE_ASC: { title: 1 },
  TITLE_DESC: { title: -1 },
};
