import { Document, Types } from 'mongoose';
import { CmsComponentType } from '../enums/component.enum';
export type CmsComponentDocument = CmsComponent & Document;
export declare class ComponentSettings {
    container: string;
    fullWidth: boolean;
    backgroundColor: string;
    paddingTop: string;
    paddingBottom: string;
}
export declare class CmsComponent {
    _id: string;
    pageId: Types.ObjectId;
    componentType: CmsComponentType;
    order: number;
    isVisible: boolean;
    settings: ComponentSettings;
    data: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
export declare const CmsComponentSchema: import("mongoose").Schema<CmsComponent, import("mongoose").Model<CmsComponent, any, any, any, Document<unknown, any, CmsComponent, any, {}> & CmsComponent & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CmsComponent, Document<unknown, {}, import("mongoose").FlatRecord<CmsComponent>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<CmsComponent> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
