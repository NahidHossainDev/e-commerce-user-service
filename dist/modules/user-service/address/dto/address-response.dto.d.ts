import { AddressType } from '../address.schema';
export declare class AddressResponseDto {
    _id: any;
    userId: any;
    fullName: string;
    phoneNumber: string;
    type: AddressType;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AddressMessageResponseDto {
    message: string;
}
