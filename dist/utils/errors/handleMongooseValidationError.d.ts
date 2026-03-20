import { Error as MongooseError } from 'mongoose';
import { IErrorMsg, IGenericError } from 'src/common/interface';
interface MongoError extends Error {
    code?: number;
    keyPattern?: Record<string, unknown>;
    keyValue?: Record<string, unknown>;
}
export declare const isDuplicateKeyError: (error: unknown) => error is MongoError;
export declare const isMongooseValidationError: (error: unknown) => error is MongooseError.ValidationError;
export declare const isMongooseCastError: (error: unknown) => error is MongooseError.CastError;
export declare const handleMongooseValidationErr: (err: MongooseError.ValidationError) => IErrorMsg[];
export declare const handleCastError: (err: unknown) => IGenericError;
export declare const handleMongooseValidationError: (err: unknown) => IGenericError;
export declare const handleDuplicateKeyError: (error: unknown) => IGenericError;
export {};
