import { Document } from 'mongoose';
export type BrandDocument = Brand & Document;
declare class SocialMedia {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
}
export declare class Brand {
    name: string;
    slug: string;
    description: string;
    logo: string;
    website: string;
    establishedYear: number;
    country: string;
    isActive: boolean;
    socialMedia: SocialMedia;
    productCount: number;
    averageRating: number;
    meta: {
        title: string;
        description: string;
        keywords: string[];
    };
}
export declare const BrandSchema: import("mongoose").Schema<Brand, import("mongoose").Model<Brand, any, any, any, Document<unknown, any, Brand, any, {}> & Brand & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Brand, Document<unknown, {}, import("mongoose").FlatRecord<Brand>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Brand> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export {};
