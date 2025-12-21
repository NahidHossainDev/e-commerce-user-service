import { ReviewQueryOptionsDto } from "./dto/review-query-options.dto";


export const reviewSearchableFields = ['title', 'comment'];

export const reviewFilterableFields: (keyof ReviewQueryOptionsDto)[] = [
  'searchTerm',
  'productId',
  'user',
  'rating',
  'status',
  'isVerifiedPurchase',
] as const;
