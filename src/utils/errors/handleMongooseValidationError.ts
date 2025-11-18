import { Error as MongooseError } from 'mongoose';
import { IErrorMsg, IGenericError } from 'src/common/interface';
import { formatCamelCase } from '../helpers';

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, unknown>;
  keyValue?: Record<string, unknown>;
}

export const isDuplicateKeyError = (error: unknown): error is MongoError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as MongoError).code === 11000
  );
};
export const isMongooseValidationError = (
  error: unknown,
): error is MongooseError.ValidationError => {
  return error instanceof MongooseError.ValidationError;
};

export const isMongooseCastError = (
  error: unknown,
): error is MongooseError.CastError => {
  return error instanceof MongooseError.CastError;
};

export const handleMongooseValidationErr = (
  err: MongooseError.ValidationError,
): IErrorMsg[] => {
  if (err?.errors) {
    return Object.values(err.errors).map((el) => ({
      path: el?.path || 'unknown',
      message: el?.message || 'Validation failed',
    }));
  }
  return [];
};

export const handleCastError = (err: unknown): IGenericError => {
  const castError = err as MongooseError.CastError;
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

export const handleMongooseValidationError = (err: unknown): IGenericError => {
  const validationError = err as MongooseError.ValidationError;
  return {
    statusCode: 400,
    message: 'Validation Error',
    errorMsg: handleMongooseValidationErr(validationError),
  };
};

export const handleDuplicateKeyError = (error: unknown): IGenericError => {
  const mongoError = error as MongoError;
  const keyPattern = mongoError.keyPattern || {};
  const field = Object.keys(keyPattern)[0] || 'field';

  return {
    statusCode: 409,
    message: 'Duplicate Key Error',
    errorMsg: [
      {
        path: field,
        message: `This ${formatCamelCase(field)} already exists`,
      },
    ],
  };
};
