import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { sendError } from '../utils/response.utils';

export const validate = (schema: z.ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        sendError(res, 'Validation failed', 400, { errors });
      } else {
        next(error);
      }
    }
  };
};
