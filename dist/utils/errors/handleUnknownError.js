"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUnknownError = void 0;
const handleUnknownError = (error) => {
    let message = 'Internal Server Error';
    let stack;
    if (error instanceof Error) {
        message = error.message || message;
        stack = error.stack;
    }
    else if (typeof error === 'string') {
        message = error;
    }
    else if (typeof error === 'object' && error !== null) {
        const errorObj = error;
        if ('message' in errorObj && typeof errorObj.message === 'string') {
            message = errorObj.message;
        }
    }
    return {
        statusCode: 500,
        message,
        errorMsg: [],
        stack: process.env.NODE_ENV === 'development' ? stack : undefined,
    };
};
exports.handleUnknownError = handleUnknownError;
//# sourceMappingURL=handleUnknownError.js.map