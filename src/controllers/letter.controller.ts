import { Request, Response, NextFunction } from 'express';
import { letterService } from '../services/letter.service';
import { LetterError } from '../types/letter.types';
import { sendSuccess } from '../utils/response.utils';
import {
  CreateLetterRequest,
  UpdateLetterRequest,
  UpdateGuestLetterRequest,
  GetLetterParams,
  GetLetterByIdParams,
  DeleteLetterParams,
  DeleteGuestLetterRequest,
  ListLettersQuery,
} from '../validations/letter.validation';

export class LetterController {
  /**
   * Create a new letter (authenticated user)
   */
  createLetter = async (
    req: Request<{}, {}, CreateLetterRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user?.userId) {
        throw new LetterError('Authentication required');
      }

      const result = await letterService.createLetter(req.user.userId, req.body);
      sendSuccess(res, result, 'Letter created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new letter (guest)
   */
  createGuestLetter = async (
    req: Request<{}, {}, CreateLetterRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await letterService.createGuestLetter(req.body);
      sendSuccess(res, result, 'Letter created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a letter by slug
   */
  getLetter = async (
    req: Request<GetLetterParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await letterService.getLetter(req.params.slug, req.user?.userId);
      sendSuccess(res, result, 'Letter retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a letter by ID (owner only)
   */
  getLetterById = async (
    req: Request<GetLetterByIdParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user?.userId) {
        throw new LetterError('Authentication required');
      }

      const result = await letterService.getLetterById(req.params.id, req.user.userId);
      sendSuccess(res, result, 'Letter retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a letter (authenticated user)
   */
  updateLetter = async (
    req: Request<GetLetterByIdParams, {}, UpdateLetterRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user?.userId) {
        throw new LetterError('Authentication required');
      }

      const result = await letterService.updateLetter(req.params.id, req.user.userId, req.body);
      sendSuccess(res, result, 'Letter updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a letter (guest)
   */
  updateGuestLetter = async (
    req: Request<GetLetterByIdParams, {}, UpdateGuestLetterRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await letterService.updateGuestLetter(
        req.params.id,
        req.body.guestToken,
        req.body,
      );
      sendSuccess(res, result, 'Letter updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a letter (authenticated user)
   */
  deleteLetter = async (
    req: Request<DeleteLetterParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user?.userId) {
        throw new LetterError('Authentication required');
      }

      await letterService.deleteLetter(req.params.id, req.user.userId);
      sendSuccess(res, null, 'Letter deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a letter (guest)
   */
  deleteGuestLetter = async (
    req: Request<DeleteLetterParams, {}, DeleteGuestLetterRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await letterService.deleteGuestLetter(req.params.id, req.body.guestToken);
      sendSuccess(res, null, 'Letter deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * List all letters for the authenticated user
   */
  listMyLetters = async (
    req: Request<{}, {}, {}, ListLettersQuery>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user?.userId) {
        throw new LetterError('Authentication required');
      }

      const result = await letterService.listMyLetters(req.user.userId, {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
      });
      sendSuccess(res, result, 'Letters retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
