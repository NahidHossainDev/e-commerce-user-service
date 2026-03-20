import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { CategoryQueryOptionsDto } from './dto/category-query-options.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';
export declare class CategoryService {
    private readonly categoryModel;
    private readonly eventEmitter;
    constructor(categoryModel: Model<CategoryDocument>, eventEmitter: EventEmitter2);
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryDocument>;
    findAll(query: CategoryQueryOptionsDto): Promise<import("../../../common/interface").IPaginatedResponse<import("mongoose").Document<unknown, {}, Category, {}, {}> & Category & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    findOne(id: string): Promise<CategoryDocument>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDocument>;
    remove(id: string): Promise<CategoryDocument>;
    findAllPublic(): Promise<CategoryDocument[]>;
    getPublicCategoryTree(): Promise<Category[]>;
    getBySlug(slug: string): Promise<CategoryDocument>;
}
