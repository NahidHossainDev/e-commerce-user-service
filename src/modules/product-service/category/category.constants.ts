import { CategoryQueryOptionsDto } from './dto/category-query-options.dto';

export const categorySearchableFields = ['name', 'slug', 'description'];

export const categoryFilterableFields: (keyof CategoryQueryOptionsDto)[] = [
  'searchTerm',
  'isActive',
  'parentCategory',
  'level',
];
