import { HydratedDocument, Types } from 'mongoose';
export declare enum VerificationTokenType {
    EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
    PASSWORD_RESET = "PASSWORD_RESET"
}
export type VerificationTokenDocument = HydratedDocument<VerificationToken>;
export declare class VerificationToken {
    userId: Types.ObjectId;
    tokenHash: string;
    type: VerificationTokenType;
    expiresAt: Date;
    used: boolean;
}
export declare const VerificationTokenSchema: import("mongoose").Schema<VerificationToken, import("mongoose").Model<VerificationToken, any, any, any, import("mongoose").Document<unknown, any, VerificationToken, any, {}> & VerificationToken & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VerificationToken, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<VerificationToken>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<VerificationToken> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
