import { ValidationError } from 'class-validator';
import { IErrorMsg, IGenericError } from 'src/common/interface';

export const isClassValidatorError = (
  errors: unknown,
): errors is ValidationError[] => {
  return (
    Array.isArray(errors) &&
    errors.length > 0 &&
    errors.every((e) => e instanceof ValidationError)
  );
};

export const handleClassValidatorErrors = (
  errors: ValidationError[],
): IErrorMsg[] => {
  const messages: IErrorMsg[] = [];

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
      messages.push(...handleClassValidatorErrors(error.children));
    }
  }

  return messages;
};

export const handleValidationError = (
  errors: ValidationError[],
): IGenericError => {
  return {
    statusCode: 400,
    message: 'Validation Error',
    errorMsg: handleClassValidatorErrors(errors),
  };
};
