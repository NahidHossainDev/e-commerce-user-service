import { HydratedDocument } from 'mongoose';
export type OtpLogDocument = HydratedDocument<OtpLog>;
export declare class OtpLog {
    phoneNumber: string;
    attemptedAt: Date;
    success: boolean;
    expiresAt: Date;
}
export declare const OtpLogSchema: import("mongoose").Schema<OtpLog, import("mongoose").Model<OtpLog, any, any, any, import("mongoose").Document<unknown, any, OtpLog, any, {}> & OtpLog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OtpLog, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<OtpLog>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<OtpLog> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
