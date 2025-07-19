import { z } from 'zod';

// Common validation schemas
const contentSchema = z
  .string()
  .min(1, 'Content is required')
  .refine(
    (val) => {
      try {
        const parsed = JSON.parse(val);
        return typeof parsed === 'object';
      } catch {
        return false;
      }
    },
    { message: 'Content must be valid JSON' },
  );

const titleSchema = z.string().max(255, 'Title is too long').optional();

// Guest token validation
const guestTokenSchema = z.string().length(64, 'Invalid guest token');

// Request validation schemas
export const createLetterSchema = z.object({
  body: z.object({
    title: titleSchema,
    content: contentSchema,
    isPublic: z.boolean().optional().default(true),
  }),
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

export const updateLetterSchema = z.object({
  body: z
    .object({
      title: titleSchema,
      content: contentSchema.optional(),
      isPublic: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
  query: z.object({}).strict(),
  params: z
    .object({
      id: z.string().uuid('Invalid letter ID'),
    })
    .strict(),
});

export const updateGuestLetterSchema = z.object({
  body: z
    .object({
      title: titleSchema,
      content: contentSchema.optional(),
      isPublic: z.boolean().optional(),
      guestToken: guestTokenSchema,
    })
    .refine((data) => Object.keys(data).length > 1, {
      // > 1 because guestToken is required
      message: 'At least one field must be provided for update',
    }),
  query: z.object({}).strict(),
  params: z
    .object({
      id: z.string().uuid('Invalid letter ID'),
    })
    .strict(),
});

export const getLetterSchema = z.object({
  body: z.undefined(),
  query: z.object({}).strict(),
  params: z
    .object({
      slug: z.string().min(1, 'Letter slug is required'),
    })
    .strict(),
});

export const getLetterByIdSchema = z.object({
  body: z.undefined(),
  query: z.object({}).strict(),
  params: z
    .object({
      id: z.string().uuid('Invalid letter ID'),
    })
    .strict(),
});

export const deleteLetterSchema = z.object({
  body: z.undefined(),
  query: z.object({}).strict(),
  params: z
    .object({
      id: z.string().uuid('Invalid letter ID'),
    })
    .strict(),
});

export const deleteGuestLetterSchema = z.object({
  body: z
    .object({
      guestToken: guestTokenSchema,
    })
    .strict(),
  query: z.object({}).strict(),
  params: z
    .object({
      id: z.string().uuid('Invalid letter ID'),
    })
    .strict(),
});

export const listLettersSchema = z.object({
  body: z.undefined(),
  query: z
    .object({
      page: z.string().regex(/^\d+$/).transform(Number).optional(),
      limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    })
    .strict(),
  params: z.object({}).strict(),
});

// Export types for request bodies/params
export type CreateLetterRequest = z.infer<typeof createLetterSchema>['body'];
export type UpdateLetterRequest = z.infer<typeof updateLetterSchema>['body'];
export type UpdateGuestLetterRequest = z.infer<typeof updateGuestLetterSchema>['body'];
export type UpdateLetterParams = z.infer<typeof updateLetterSchema>['params'];
export type GetLetterParams = z.infer<typeof getLetterSchema>['params'];
export type GetLetterByIdParams = z.infer<typeof getLetterByIdSchema>['params'];
export type DeleteLetterParams = z.infer<typeof deleteLetterSchema>['params'];
export type DeleteGuestLetterRequest = z.infer<typeof deleteGuestLetterSchema>['body'];
export type ListLettersQuery = z.infer<typeof listLettersSchema>['query'];
