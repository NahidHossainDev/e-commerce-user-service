import { ValidationError } from 'class-validator';
import { IErrorMsg, IGenericError } from 'src/common/interface';
export declare const isClassValidatorError: (errors: unknown) => boolean;
export declare const isStringArray: (errors: unknown) => errors is string[];
export declare const handleClassValidatorErrors: (errors: ValidationError[]) => IErrorMsg[];
export declare const handleValidationError: (errors: ValidationError[]) => IGenericError;
