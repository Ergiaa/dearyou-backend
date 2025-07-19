import { z } from 'zod';

// Common validation schemas
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password is too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  );

const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(255, 'Email is too long')
  .transform((email) => email.toLowerCase());

const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name is too long')
  .optional();

// Request validation schemas
export const registerSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema,
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

// Export types for request bodies
export type RegisterRequest = z.infer<typeof registerSchema>['body'];
export type LoginRequest = z.infer<typeof loginSchema>['body'];
export type UpdatePasswordRequest = z.infer<typeof updatePasswordSchema>['body'];
