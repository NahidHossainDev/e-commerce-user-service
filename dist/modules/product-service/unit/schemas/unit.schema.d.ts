import { HydratedDocument } from 'mongoose';
export type UnitDocument = HydratedDocument<Unit>;
export declare enum UnitCategory {
    COUNT = "COUNT",
    WEIGHT = "WEIGHT",
    VOLUME = "VOLUME",
    LENGTH = "LENGTH",
    AREA = "AREA",
    TIME = "TIME",
    DIGITAL = "DIGITAL",
    CUSTOM = "CUSTOM"
}
export declare class Unit {
    name: string;
    symbol: string;
    category: UnitCategory;
    allowsDecimal: boolean;
}
export declare const UnitSchema: import("mongoose").Schema<Unit, import("mongoose").Model<Unit, any, any, any, import("mongoose").Document<unknown, any, Unit, any, {}> & Unit & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Unit, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Unit>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Unit> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
