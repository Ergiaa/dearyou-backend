import { Request, Response, NextFunction } from 'express';
import { AuthError } from '../types/auth.types';
import { LetterError } from '../types/letter.types';
import { ZodError } from 'zod';
import { sendError } from '../utils/response.utils';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error('Error:', error);

  // Handle custom domain errors
  if (error instanceof AuthError) {
    sendError(res, error.message, 401);
    return;
  }

  if (error instanceof LetterError) {
    // 404 for not found, 403 for unauthorized access
    const status = error.message.includes('not found') ? 404 : 403;
    sendError(res, error.message, status);
    return;
  }

  // Handle validation errors
  if (error instanceof ZodError) {
    sendError(res, 'Validation failed', 400, {
      errors: error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
    return;
  }

  // Handle unexpected errors
  sendError(res, 'An unexpected error occurred', 500);
};
