export const couponFilterableFields = [
  'searchTerm',
  'code',
  'name',
  'discountType',
  'discountValue',
  'validFrom',
  'validTo',
  'usageLimit',
  'usageCount',
  'usageLimitPerUser',
  'isActive',
];

export const couponSearchableFields = ['code', 'name'];

export const couponSortOptions = {
  NEWEST: { createdAt: -1 },
  OLDEST: { createdAt: 1 },
  DISCOUNT_HIGH_LOW: { discountValue: -1 },
  DISCOUNT_LOW_HIGH: { discountValue: 1 },
  USAGE_LIMIT_HIGH_LOW: { usageLimit: -1 },
  USAGE_LIMIT_LOW_HIGH: { usageLimit: 1 },
};
