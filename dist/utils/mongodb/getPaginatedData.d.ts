import { Document, FilterQuery, Model, PipelineStage } from 'mongoose';
import { IPaginateCalculateResult, IPaginatedResponse } from 'src/common/interface';
interface IPropsType<T> {
    model: Model<T>;
    paginationQuery: IPaginateCalculateResult;
    filterQuery?: FilterQuery<T>;
    project?: Record<string, unknown>;
    stageArr?: PipelineStage[];
    useAggregate?: boolean;
}
export declare function getPaginatedData<T extends Document>({ model, paginationQuery, project, filterQuery, stageArr, useAggregate, }: IPropsType<T>): Promise<IPaginatedResponse<T>>;
export {};
