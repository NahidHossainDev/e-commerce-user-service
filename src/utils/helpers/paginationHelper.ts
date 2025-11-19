import {
  IPaginateCalculateResult,
  IPaginationQuery,
} from 'src/common/interface';

const calculatePagination = (
  options: IPaginationQuery,
): IPaginateCalculateResult => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || -1;

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const paginationHelpers = {
  calculatePagination,
};
