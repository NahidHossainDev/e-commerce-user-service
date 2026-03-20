"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNotFutureDate = IsNotFutureDate;
const class_validator_1 = require("class-validator");
function IsNotFutureDate(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isNotFutureDate',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const date = new Date(value);
                    const now = new Date();
                    return date <= now;
                },
                defaultMessage(args) {
                    return `${args.property} must not be a future date`;
                },
            },
        });
    };
}
//# sourceMappingURL=isFutureDate.js.map