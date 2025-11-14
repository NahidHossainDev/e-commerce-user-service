// src/common/paginate.ts
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { Paginate } from './paginate.interface';

export async function paginate<T extends { [k: string]: any }>(
  model: Model<T>,
  pageNum = 1,
  filterQuery: FilterQuery<T> = {},
  project: Record<string, unknown> = {},
  limit = 20,
): Promise<Paginate<T[]>> {
  const page = Math.max(1, pageNum);
  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    model
      .find(filterQuery, project)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()
      .exec(),
    model.countDocuments(filterQuery).exec(),
  ]);

  const totalPages = total > 0 ? Math.ceil(total / limit) : 0;
  const nextPage = page < totalPages ? page + 1 : null;

  return {
    items: docs as T[],
    total,
    totalPages,
    nextPage,
    pageNumber: page,
  };
}

export async function paginateAggregate<TDocument extends { [k: string]: any }>(
  model: Model<TDocument>,
  pageNum = 1,
  stageArr: PipelineStage[] = [],
  filterQuery: FilterQuery<TDocument> = {},
  limit = 20,
): Promise<Paginate<TDocument[]>> {
  const page = Math.max(1, pageNum);
  const skip = (page - 1) * limit;

  const pipeline: PipelineStage[] = [
    ...stageArr,
    { $skip: skip },
    { $limit: limit },
  ];

  const [docs, total] = await Promise.all([
    model.aggregate(pipeline).exec(),
    model.countDocuments(filterQuery).exec(),
  ]);

  const totalPages = total > 0 ? Math.ceil(total / limit) : 0;
  const nextPage = page < totalPages ? page + 1 : null;

  return {
    items: docs as TDocument[],
    total,
    totalPages,
    nextPage,
    pageNumber: page,
  };
}
