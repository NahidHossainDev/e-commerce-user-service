import { FilterQuery, Model, PipelineStage } from 'mongoose';
import {
  IPaginateCalculateResult,
  IPaginatedResponse,
} from 'src/common/interface';
interface IPropsType<T extends Document> {
  model: Model<T>;
  paginationQuery: IPaginateCalculateResult;
  filterQuery?: FilterQuery<T>;
  project?: Record<string, unknown>;
  stageArr?: PipelineStage[];
  useAggregate?: boolean; // allow manual override
}

export async function getPaginatedData<T extends Document>({
  model,
  paginationQuery,
  project,
  filterQuery = {},
  stageArr = [],
  useAggregate = false,
}: IPropsType<T>): Promise<IPaginatedResponse<T>> {
  const { skip, limit, sortBy, sortOrder, page } = paginationQuery;
  const shouldUseAggregate = useAggregate || stageArr.length > 0;
  let pipeline: PipelineStage[] = [];

  if (shouldUseAggregate) {
    pipeline = [
      { $match: filterQuery },
      ...stageArr,
      { $sort: { [sortBy]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
    ];

    if (project) {
      pipeline.push({ $project: project });
    }
  }

  const [data, totalCount] = await Promise.all([
    shouldUseAggregate
      ? model.aggregate(pipeline).exec()
      : model
          .find(filterQuery, project)
          .sort({ [sortBy]: sortOrder })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),

    model.countDocuments(filterQuery).exec(),
  ]);

  const totalPages = totalCount > 0 ? Math.ceil(totalCount / limit) : 0;
  const nextPage = page < totalPages ? page + 1 : null;

  return {
    meta: {
      totalCount,
      page,
      nextPage,
      limit,
      totalPages: totalPages,
    },
    data: data as T[],
  };
}
