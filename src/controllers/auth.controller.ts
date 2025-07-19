import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthError } from '../types/auth.types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      // Basic validation
      if (!email || !password) {
        throw new AuthError('Email and password are required');
      }

      const result = await this.authService.register({ email, password, name });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Basic validation
      if (!email || !password) {
        throw new AuthError('Email and password are required');
      }

      const result = await this.authService.login({ email, password });
      res.json(result);
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
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update password
   */
  updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new AuthError('Authentication required');
      }

      if (!oldPassword || !newPassword) {
        throw new AuthError('Old password and new password are required');
      }

      await this.authService.updatePassword(userId, oldPassword, newPassword);
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  };
}
