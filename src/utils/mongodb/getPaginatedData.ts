import { Document, FilterQuery, Model, PipelineStage } from 'mongoose';
import {
  IPaginateCalculateResult,
  IPaginatedResponse,
} from 'src/common/interface';
interface IPropsType<T> {
  model: Model<T>;
  paginationQuery: IPaginateCalculateResult;
  filterQuery?: FilterQuery<T>;
  project?: Record<string, unknown>;
  stageArr?: PipelineStage[];
  useAggregate?: boolean; // allow manual override
  populate?: string | string[];
}

export async function getPaginatedData<T extends Document>({
  model,
  paginationQuery,
  project,
  filterQuery = {},
  stageArr = [],
  useAggregate = false,
  populate,
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
      : (() => {
          let query = model
            .find(filterQuery, project)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);
          if (populate) {
            query = query.populate(populate) as any;
          }
          return query.lean().exec();
        })(),

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
