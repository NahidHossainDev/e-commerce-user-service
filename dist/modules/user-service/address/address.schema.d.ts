import { HydratedDocument, Types } from 'mongoose';
export type AddressDocument = HydratedDocument<Address>;
export declare enum AddressType {
    HOME = "HOME",
    WORK = "WORK",
    OFFICE = "OFFICE",
    OTHER = "SUPER_ADMIN"
}
export declare class Address {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    fullName: string;
    phoneNumber: string;
    type: AddressType;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}
export declare const AddressSchema: import("mongoose").Schema<Address, import("mongoose").Model<Address, any, any, any, import("mongoose").Document<unknown, any, Address, any, {}> & Address & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Address, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Address>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Address> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
