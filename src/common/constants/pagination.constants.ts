import { QueryOptions } from '../dto/queryOptions.dto';

export const paginateOptions: (keyof QueryOptions)[] = [
  'page',
  'limit',
  'sortBy',
  'sortOrder',
];
