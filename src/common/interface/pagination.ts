export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 1 | -1;
}

export interface IPaginateCalculateResult extends Required<IPaginationQuery> {
  skip: number;
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
