import { HydratedDocument, Types } from 'mongoose';
export type DeliveryConfigDocument = HydratedDocument<DeliveryConfig>;
export declare enum FreeDeliveryPolicy {
    NONE = "NONE",
    MIN_ORDER_AMOUNT = "MIN_ORDER_AMOUNT",
    ALWAYS_FREE = "ALWAYS_FREE"
}
export declare class DeliveryZone {
    _id: Types.ObjectId;
    name: string;
    code: string;
    deliveryFee: number;
    isDefault: boolean;
    isActive: boolean;
    matchedCities: string[];
    freeDeliveryPolicy: FreeDeliveryPolicy;
    minOrderForFreeDelivery?: number | null;
    estimatedDays?: string;
}
export declare const DeliveryZoneSchema: import("mongoose").Schema<DeliveryZone, import("mongoose").Model<DeliveryZone, any, any, any, import("mongoose").Document<unknown, any, DeliveryZone, any, {}> & DeliveryZone & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DeliveryZone, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<DeliveryZone>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<DeliveryZone> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export declare class DeliveryConfig {
    _id: Types.ObjectId;
    defaultFee: number;
    enableGlobalFreeDelivery: boolean;
    globalFreeDeliveryMinOrder?: number | null;
    zones: DeliveryZone[];
}
export declare const DeliveryConfigSchema: import("mongoose").Schema<DeliveryConfig, import("mongoose").Model<DeliveryConfig, any, any, any, import("mongoose").Document<unknown, any, DeliveryConfig, any, {}> & DeliveryConfig & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DeliveryConfig, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<DeliveryConfig>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<DeliveryConfig> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
