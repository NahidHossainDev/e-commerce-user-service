import { Types } from 'mongoose';

/**
 * Generates a URL-friendly slug from a string.
 * @param text The text to slugify.
 * @returns Sluggified string.
 */
export const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

/**
 * Calculates the discounted price based on base price and discount rate.
 * @param basePrice The original price.
 * @param discountRate The discount percentage (0-100).
 * @returns The final discounted price.
 */
export const calculateDiscountedPrice = (
  basePrice: number,
  discountRate: number,
): number => {
  if (!discountRate || discountRate <= 0) return basePrice;
  const discountAmount = (basePrice * discountRate) / 100;
  return Number((basePrice - discountAmount).toFixed(2));
};

/**
 * Generates a unique SKU for a product.
 * @param brandName Brand name or prefix.
 * @param categoryName Category name or prefix.
 * @param suffix Unique identifier or sequence.
 * @returns Generated SKU.
 */
export const generateSKU = (
  brandName: string,
  categoryName: string,
  suffix?: string,
): string => {
  const brandPfx = brandName.substring(0, 3).toUpperCase();
  const catPfx = categoryName.substring(0, 3).toUpperCase();
  const randomSuffix =
    suffix || Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${brandPfx}-${catPfx}-${randomSuffix}`.toLowerCase();
};

/**
 * Validates if a string is a valid MongoDB ObjectId.
 * @param id The ID to validate.
 * @returns Boolean indicating validity.
 */
export const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};
