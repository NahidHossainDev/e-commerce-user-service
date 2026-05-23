import { Document, Types } from 'mongoose';
import { CmsPageStatus, CmsPageType } from '../enums/page.enum';
export type CmsPageDocument = CmsPage & Document;
export declare class CmsPageSeo {
    title?: string;
    description?: string;
    keywords?: string[];
}
export declare class CmsPage {
    title: string;
    slug: string;
    type: CmsPageType;
    status: CmsPageStatus;
    isHomePage: boolean;
    seo: CmsPageSeo;
    componentIds: Types.ObjectId[];
    createdBy?: string;
    updatedBy?: string;
}
export declare const CmsPageSchema: import("mongoose").Schema<CmsPage, import("mongoose").Model<CmsPage, any, any, any, Document<unknown, any, CmsPage, any, {}> & CmsPage & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CmsPage, Document<unknown, {}, import("mongoose").FlatRecord<CmsPage>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<CmsPage> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
