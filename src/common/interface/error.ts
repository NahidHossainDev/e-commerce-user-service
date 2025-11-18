export type IErrorMsg = {
  path: string | number;
  message: string;
};

export type IGenericError = {
  statusCode: number;
  message: string;
  errorMsg: IErrorMsg[];
  stack?: string;
};
