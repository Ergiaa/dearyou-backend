import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthError } from '../types/auth.types';
import { sendSuccess } from '../utils/response.utils';
import {
  RegisterRequest,
  LoginRequest,
  UpdatePasswordRequest,
} from '../validations/auth.validation';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   */
  register = async (
    req: Request<{}, {}, RegisterRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      sendSuccess(res, result, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   */
  login = async (
    req: Request<{}, {}, LoginRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current user profile
   */
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user?.userId) {
        throw new AuthError('Authentication required');
      }

      const user = await this.authService.validateToken(req.user.userId);
      sendSuccess(res, user, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update password
   */
  updatePassword = async (
    req: Request<{}, {}, UpdatePasswordRequest>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AuthError('Authentication required');
      }

      await this.authService.updatePassword(userId, oldPassword, newPassword);
      sendSuccess(res, null, 'Password updated successfully');
    } catch (error) {
      next(error);
    }
  };
}
