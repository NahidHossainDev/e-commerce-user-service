import { Types } from 'mongoose';

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

export interface IValidatedAddress {
  _id?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  fullName?: string;
  phoneNumber?: string;
  type?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

export interface IAddressValidationResult {
  isValid: boolean;
  error?: string;
  address?: IValidatedAddress;
}

export class AddressValidationResult {
  public readonly isValid: boolean;
  public readonly error?: string;
  public readonly address?: IValidatedAddress;

  constructor(params: IAddressValidationResult) {
    this.isValid = params.isValid;
    this.error = params.error;
    this.address = params.address;
  }
}

export const UserEvents = {
  VALIDATE_ADDRESS: 'user.address.validate',
};
