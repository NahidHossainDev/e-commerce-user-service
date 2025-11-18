import { IGenericError } from 'src/common/interface';

export const handleUnknownError = (error: unknown): IGenericError => {
  let message = 'Internal Server Error';
  let stack: string | undefined;

  if (error instanceof Error) {
    message = error.message || message;
    stack = error.stack;
  } else if (typeof error === 'string') {
    message = error;
  } else if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
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
