import { Response } from 'express';

type ValidationError = {
  field: string;
  message: string;
};

type ApiResponse = {
  status: number;
  message: string;
  data?: unknown;
  errors?: ValidationError[];
};

export const sendSuccess = <T>(
  res: Response,
  data: T | null,
  message: string = 'Success',
  status: number = 200,
): void => {
  const response: Partial<ApiResponse> = {
    status,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  res.status(status).json(response);
};

export const sendError = (
  res: Response,
  message: string = 'Internal Server Error',
  status: number = 500,
  options?: { errors?: ValidationError[] },
): void => {
  const response: Partial<ApiResponse> = {
    status,
    message,
  };

  if (options?.errors) {
    response.errors = options.errors;
  }

  res.status(status).json(response);
};
