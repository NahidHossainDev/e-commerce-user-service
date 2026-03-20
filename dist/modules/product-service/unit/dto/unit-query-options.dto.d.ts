import { QueryOptions } from 'src/common/dto/queryOptions.dto';
import { UnitCategory } from '../schemas/unit.schema';
export declare class UnitQueryOptions extends QueryOptions {
    searchTerm?: string;
    category?: UnitCategory;
}
