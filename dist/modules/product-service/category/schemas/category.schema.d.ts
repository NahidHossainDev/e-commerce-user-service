import { HydratedDocument, Types } from 'mongoose';
export type CategoryDocument = HydratedDocument<Category>;
export declare class Category {
    _id: Types.ObjectId;
    name: string;
    slug: string;
    description: string;
    image: string;
    parentCategory: Types.ObjectId;
    level: number;
    path: string;
    isActive: boolean;
    productCount: number;
    sortOrder: number;
    children: Category[];
    meta: {
        title: string;
        description: string;
    };
}
export declare const CategorySchema: import("mongoose").Schema<Category, import("mongoose").Model<Category, any, any, any, import("mongoose").Document<unknown, any, Category, any, {}> & Category & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Category, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Category>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Category> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
