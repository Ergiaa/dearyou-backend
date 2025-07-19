import { Request, Response, NextFunction } from 'express';
import { AuthError } from '../types/auth.types';
import { sendError } from '../utils/response.utils';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error('Error:', error.message);

  if (error instanceof AuthError) {
    sendError(res, error.message, 401);
    return;
  }

  // Handle other types of errors
  sendError(res, 'An unexpected error occurred');
};
