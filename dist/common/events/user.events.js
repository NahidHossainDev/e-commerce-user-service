"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvents = exports.AddressValidationResult = exports.AddressValidateEvent = void 0;
class AddressValidateEvent {
    userId;
    addressId;
    constructor(params) {
        this.userId = params.userId;
        this.addressId = params.addressId;
    }
}
exports.AddressValidateEvent = AddressValidateEvent;
class AddressValidationResult {
    isValid;
    error;
    constructor(params) {
        this.isValid = params.isValid;
        this.error = params.error;
    }
}
exports.AddressValidationResult = AddressValidationResult;
exports.UserEvents = {
    VALIDATE_ADDRESS: 'user.address.validate',
};
//# sourceMappingURL=user.events.js.map