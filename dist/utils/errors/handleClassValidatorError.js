"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = exports.handleClassValidatorErrors = exports.isStringArray = exports.isClassValidatorError = void 0;
const isClassValidatorError = (errors) => {
    return (Array.isArray(errors) &&
        errors.length > 0 &&
        errors.every((e) => typeof e === 'object' && e !== null && 'property' in e));
};
exports.isClassValidatorError = isClassValidatorError;
const isStringArray = (errors) => {
    return (Array.isArray(errors) &&
        errors.length > 0 &&
        errors.every((e) => typeof e === 'string'));
};
exports.isStringArray = isStringArray;
const handleClassValidatorErrors = (errors) => {
    const messages = [];
    for (const error of errors) {
        if (error.constraints) {
            for (const msg of Object.values(error.constraints)) {
                messages.push({
                    path: error.property,
                    message: msg,
                });
            }
        }
        if (error.children && error.children.length > 0) {
            messages.push(...(0, exports.handleClassValidatorErrors)(error.children));
        }
    }
    return messages;
};
exports.handleClassValidatorErrors = handleClassValidatorErrors;
const handleValidationError = (errors) => {
    return {
        statusCode: 400,
        message: 'Validation Error',
        errorMsg: (0, exports.handleClassValidatorErrors)(errors),
    };
};
exports.handleValidationError = handleValidationError;
//# sourceMappingURL=handleClassValidatorError.js.map