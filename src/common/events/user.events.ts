export interface IAddressValidateEvent {
  userId: string;
  addressId: string;
}

export class AddressValidateEvent {
  public readonly userId: string;
  public readonly addressId: string;

  constructor(params: IAddressValidateEvent) {
    this.userId = params.userId;
    this.addressId = params.addressId;
  }
}

export interface IAddressValidationResult {
  isValid: boolean;
  error?: string;
}

export class AddressValidationResult {
  public readonly isValid: boolean;
  public readonly error?: string;

  constructor(params: IAddressValidationResult) {
    this.isValid = params.isValid;
    this.error = params.error;
  }
}

export const UserEvents = {
  VALIDATE_ADDRESS: 'user.address.validate',
};
