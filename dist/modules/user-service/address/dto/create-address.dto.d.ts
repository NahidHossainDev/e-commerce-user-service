import { AddressType } from '../address.schema';
export declare class CreateAddressDto {
    userId: string;
    fullName: string;
    phoneNumber: string;
    type: AddressType;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}
