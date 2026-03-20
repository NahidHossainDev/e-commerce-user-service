export interface IAddressValidateEvent {
    userId: string;
    addressId: string;
}
export declare class AddressValidateEvent {
    readonly userId: string;
    readonly addressId: string;
    constructor(params: IAddressValidateEvent);
}
export interface IAddressValidationResult {
    isValid: boolean;
    error?: string;
}
export declare class AddressValidationResult {
    readonly isValid: boolean;
    readonly error?: string;
    constructor(params: IAddressValidationResult);
}
export declare const UserEvents: {
    VALIDATE_ADDRESS: string;
};
