import { QueryOptions } from 'src/common/dto/queryOptions.dto';
import { Gender, UserRole } from '../user.schema';
export declare class UserQueryOptions extends QueryOptions {
    searchTerm?: string;
    gender?: Gender;
    userRole?: UserRole;
}
