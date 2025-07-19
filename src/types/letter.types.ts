import { Letter } from '@prisma/client';

/**
 * Custom error class for letter-related operations
 */
export class LetterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LetterError';
  }
}

/**
 * Input DTOs - Service Layer
 */
export interface CreateLetterDto {
  title?: string;
  content: string; // JSON string for rich text
  isPublic?: boolean;
}

export interface UpdateLetterDto {
  title?: string;
  content?: string;
  isPublic?: boolean;
}

/**
 * Guest Letter Types
 */
export interface GuestLetterResponse extends LetterResponse {
  guestToken: string;
}

export interface GuestLetterAccess {
  guestId: string;
  guestToken: string;
}

/**
 * Request Parameters
 */
export interface LetterIdParam {
  id: string;
}

export interface LetterSlugParam {
  slug: string;
}

/**
 * Query Parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Response Types
 */
export type LetterResponse = Omit<Letter, 'authorId' | 'guestId' | 'guestToken'> & {
  author?: {
    id: string;
    name: string | null;
  };
};

export interface PaginatedLettersResponse {
  items: LetterResponse[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Service Interface
 */
export interface ILetterService {
  // Guest letter operations
  createGuestLetter(data: CreateLetterDto): Promise<GuestLetterResponse>;
  updateGuestLetter(id: string, guestToken: string, data: UpdateLetterDto): Promise<LetterResponse>;
  deleteGuestLetter(id: string, guestToken: string): Promise<void>;

  // Regular letter operations
  createLetter(userId: string, data: CreateLetterDto): Promise<LetterResponse>;
  getLetter(slug: string, userId?: string): Promise<LetterResponse>;
  getLetterById(id: string, userId: string): Promise<LetterResponse>;
  updateLetter(id: string, userId: string, data: UpdateLetterDto): Promise<LetterResponse>;
  deleteLetter(id: string, userId: string): Promise<void>;
  listMyLetters(userId: string, pagination: PaginationParams): Promise<PaginatedLettersResponse>;
  cleanup(): Promise<void>;
}

/**
 * Request Types - Controller Layer
 */
export interface CreateLetterRequest {
  title?: string;
  content: string;
  isPublic?: boolean;
}

export interface UpdateLetterRequest {
  title?: string;
  content?: string;
  isPublic?: boolean;
}

export interface ListLettersQuery {
  page?: number;
  limit?: number;
}
