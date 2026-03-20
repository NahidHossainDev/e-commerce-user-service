import { CategoryService } from '../category.service';
export declare class PublicCategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/category.schema").Category, {}, {}> & import("../schemas/category.schema").Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getTree(): Promise<import("../schemas/category.schema").Category[]>;
    getBySlug(slug: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/category.schema").Category, {}, {}> & import("../schemas/category.schema").Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
