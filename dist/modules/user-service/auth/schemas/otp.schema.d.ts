import { HydratedDocument } from 'mongoose';
export type OtpDocument = HydratedDocument<Otp>;
export declare class Otp {
    phoneNumber: string;
    otpHash: string;
    expiresAt: Date;
    attempts: number;
    verified: boolean;
}
export declare const OtpSchema: import("mongoose").Schema<Otp, import("mongoose").Model<Otp, any, any, any, import("mongoose").Document<unknown, any, Otp, any, {}> & Otp & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Otp, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Otp>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Otp> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
