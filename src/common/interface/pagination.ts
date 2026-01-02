export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginateCalculateResult
  extends Required<Omit<IPaginationQuery, 'sortOrder'>> {
  skip: number;
  sortOrder: 1 | -1;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    totalCount: number;
    totalPages: number;
    limit: number;
    page: number;
    nextPage: number | null;
  };
}
