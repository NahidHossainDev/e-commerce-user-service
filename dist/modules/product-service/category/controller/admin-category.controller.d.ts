import { CategoryService } from '../category.service';
import { CategoryQueryOptionsDto } from '../dto/category-query-options.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
export declare class AdminCategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(createCategoryDto: CreateCategoryDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/category.schema").Category, {}, {}> & import("../schemas/category.schema").Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(query: CategoryQueryOptionsDto): Promise<import("../../../../common/interface").IPaginatedResponse<import("mongoose").Document<unknown, {}, import("../schemas/category.schema").Category, {}, {}> & import("../schemas/category.schema").Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/category.schema").Category, {}, {}> & import("../schemas/category.schema").Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/category.schema").Category, {}, {}> & import("../schemas/category.schema").Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/category.schema").Category, {}, {}> & import("../schemas/category.schema").Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
