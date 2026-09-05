import { ProductQueryDto } from './dto/product-query-options.dto';

export const PRODUCT_FILTER_FIELDS: (keyof ProductQueryDto)[] = [
  'searchTerm',
  'status',
  'categoryId',
  'category',
  'brandId',
  'brand',
  'isFeatured',
  'isBestSeller',
  'isOnOffer',
  'isNew',
  'isPerishable',
  'vendorId',
  'minPrice',
  'maxPrice',
];

export const PRODUCT_SEARCH_FIELDS = [
  '_id',
  'title',
  'slug',
  'sku',
  'barcode',
  'tags',
  'keywords',
];

export const PRODUCT_SORT_OPTIONS = {
  NEWEST: { createdAt: -1 },
  OLDEST: { createdAt: 1 },
  PRICE_LOW_HIGH: { 'price.discountPrice': 1, 'price.basePrice': 1 },
  PRICE_HIGH_LOW: { 'price.discountPrice': -1, 'price.basePrice': -1 },
  RATING_HIGH_LOW: { averageRating: -1 },
  SALES_HIGH_LOW: { salesCount: -1 },
  TITLE_ASC: { title: 1 },
  TITLE_DESC: { title: -1 },
};
