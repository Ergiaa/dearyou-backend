import { Request, Response, NextFunction } from 'express';
import { AuthError } from '../types/auth.types';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error('Error:', error.message);

  if (error instanceof AuthError) {
    res.status(401).json({
      error: 'Authentication Error',
      message: error.message,
    });
    return;
  }

  // Handle other types of errors
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
};
