"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateKeyError = exports.handleMongooseValidationError = exports.handleCastError = exports.handleMongooseValidationErr = exports.isMongooseCastError = exports.isMongooseValidationError = exports.isDuplicateKeyError = void 0;
const mongoose_1 = require("mongoose");
const helpers_1 = require("../helpers");
const isDuplicateKeyError = (error) => {
    return (typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000);
};
exports.isDuplicateKeyError = isDuplicateKeyError;
const isMongooseValidationError = (error) => {
    return error instanceof mongoose_1.Error.ValidationError;
};
exports.isMongooseValidationError = isMongooseValidationError;
const isMongooseCastError = (error) => {
    return error instanceof mongoose_1.Error.CastError;
};
exports.isMongooseCastError = isMongooseCastError;
const handleMongooseValidationErr = (err) => {
    if (err?.errors) {
        return Object.values(err.errors).map((el) => ({
            path: el?.path || 'unknown',
            message: el?.message || 'Validation failed',
        }));
    }
    return [];
};
exports.handleMongooseValidationErr = handleMongooseValidationErr;
const handleCastError = (err) => {
    const castError = err;
    return {
        statusCode: 400,
        message: 'Invalid ID format',
        errorMsg: [
            {
                path: castError.path || 'id',
                message: `Invalid ${castError.kind}: ${String(castError.value)}`,
            },
        ],
    };
};
exports.handleCastError = handleCastError;
const handleMongooseValidationError = (err) => {
    const validationError = err;
    return {
        statusCode: 400,
        message: 'Validation Error',
        errorMsg: (0, exports.handleMongooseValidationErr)(validationError),
    };
};
exports.handleMongooseValidationError = handleMongooseValidationError;
const handleDuplicateKeyError = (error) => {
    const mongoError = error;
    const keyPattern = mongoError.keyPattern || {};
    const field = Object.keys(keyPattern)[0] || 'field';
    return {
        statusCode: 409,
        message: 'Duplicate Key Error',
        errorMsg: [
            {
                path: field,
                message: `This ${(0, helpers_1.formatCamelCase)(field)} already exists`,
            },
        ],
    };
};
exports.handleDuplicateKeyError = handleDuplicateKeyError;
//# sourceMappingURL=handleMongooseValidationError.js.map