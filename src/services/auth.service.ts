import { User } from '@prisma/client';
import { BaseService } from './base.service';
import { AuthError, LoginInput, RegisterInput, AuthResponse } from '../types/auth.types';
import { comparePassword, generateToken, hashPassword } from '../utils/auth.utils';

export class AuthService extends BaseService {
  /**
   * Registers a new user
   */
  async register(input: RegisterInput): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new AuthError('Email already registered');
      }

      // Create new user with hashed password
      const hashedPassword = await hashPassword(input.password);
      const userId = this.generateEntityId();

      const user = await this.prisma.user.create({
        data: {
          id: userId,
          email: input.email,
          password: hashedPassword,
          name: input.name,
        },
      });

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      return {
        token,
        user: userWithoutPassword,
      };
    } catch (error) {
      // Ensure proper cleanup on error
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Authenticates a user and returns a token
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await this.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new AuthError('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await comparePassword(input.password, user.password);
      if (!isPasswordValid) {
        throw new AuthError('Invalid email or password');
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      return {
        token,
        user: userWithoutPassword,
      };
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Validates a user's token and returns the user data
   */
  async validateToken(userId: string): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AuthError('User not found');
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Updates a user's password
   */
  async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AuthError('User not found');
      }

      // Verify old password
      const isPasswordValid = await comparePassword(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new AuthError('Invalid current password');
      }

      // Hash and update new password
      const hashedPassword = await hashPassword(newPassword);
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }
}
