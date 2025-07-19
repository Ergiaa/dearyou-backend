import { BaseService } from './base.service';
import { uuidv7 } from 'uuidv7';
import { generateSlug } from '../utils/generateSlug';
import { generateGuestTokens } from '../utils/guest.utils';
import {
  CreateLetterDto,
  UpdateLetterDto,
  LetterResponse,
  GuestLetterResponse,
  PaginationParams,
  PaginatedLettersResponse,
  ILetterService,
  LetterError,
} from '../types/letter.types';

export class LetterService extends BaseService implements ILetterService {
  /**
   * Checks if a user has ownership of a letter
   * @throws {LetterError} if letter not found or user is not the owner
   */
  private async checkLetterOwnership(letterId: string, userId: string): Promise<void> {
    try {
      const letter = await this.prisma.letter.findUnique({
        where: { id: letterId },
        select: { authorId: true },
      });

      if (!letter) {
        throw new LetterError('Letter not found');
      }

      if (letter.authorId !== userId) {
        throw new LetterError('Unauthorized access to letter');
      }
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Checks if a guest has ownership of a letter
   * @throws {LetterError} if letter not found or guest token is invalid
   */
  private async checkGuestLetterOwnership(letterId: string, guestToken: string): Promise<void> {
    try {
      const letter = await this.prisma.letter.findUnique({
        where: { id: letterId },
        select: { guestToken: true },
      });

      if (!letter) {
        throw new LetterError('Letter not found');
      }

      if (letter.guestToken !== guestToken) {
        throw new LetterError('Invalid guest token');
      }
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Transforms a letter entity to a response object
   */
  private transformToLetterResponse(letter: any): LetterResponse {
    const { authorId, guestId, guestToken, author, ...letterData } = letter;
    return {
      ...letterData,
      author: author
        ? {
            id: author.id,
            name: author.name,
          }
        : undefined,
    };
  }

  /**
   * Creates a new guest letter
   */
  async createGuestLetter(data: CreateLetterDto): Promise<GuestLetterResponse> {
    try {
      const { guestId, guestToken } = generateGuestTokens();

      const letter = await this.prisma.letter.create({
        data: {
          id: uuidv7(),
          title: data.title || 'Untitled',
          content: data.content,
          isPublic: data.isPublic ?? true,
          slug: generateSlug(data.title),
          guestId,
          guestToken,
        },
      });

      return {
        ...this.transformToLetterResponse(letter),
        guestToken,
      };
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Updates a guest letter
   */
  async updateGuestLetter(
    id: string,
    guestToken: string,
    data: UpdateLetterDto,
  ): Promise<LetterResponse> {
    try {
      await this.checkGuestLetterOwnership(id, guestToken);

      const updateData: any = { ...data };
      if (data.title) {
        updateData.slug = generateSlug(data.title);
      }

      const letter = await this.prisma.letter.update({
        where: { id },
        data: updateData,
      });

      return this.transformToLetterResponse(letter);
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Deletes a guest letter
   */
  async deleteGuestLetter(id: string, guestToken: string): Promise<void> {
    try {
      await this.checkGuestLetterOwnership(id, guestToken);
      await this.prisma.letter.delete({ where: { id } });
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Creates a new letter
   */
  async createLetter(userId: string, data: CreateLetterDto): Promise<LetterResponse> {
    try {
      const letter = await this.prisma.letter.create({
        data: {
          id: uuidv7(),
          title: data.title || 'Untitled',
          content: data.content,
          isPublic: data.isPublic ?? true,
          slug: generateSlug(data.title),
          authorId: userId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return this.transformToLetterResponse(letter);
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Gets a letter by slug, respecting privacy settings
   */
  async getLetter(slug: string, userId?: string): Promise<LetterResponse> {
    try {
      const letter = await this.prisma.letter.findUnique({
        where: { slug },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!letter) {
        throw new LetterError('Letter not found');
      }

      // Check access permissions for non-public letters
      if (!letter.isPublic && letter.authorId && (!userId || letter.authorId !== userId)) {
        throw new LetterError('Unauthorized access to letter');
      }

      // Increment read count for public letters or when viewed by non-author
      if (letter.isPublic || (userId && letter.authorId !== userId)) {
        await this.prisma.letter.update({
          where: { id: letter.id },
          data: { readCount: { increment: 1 } },
        });
      }

      return this.transformToLetterResponse(letter);
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Gets a letter by ID (owner only)
   */
  async getLetterById(id: string, userId: string): Promise<LetterResponse> {
    try {
      await this.checkLetterOwnership(id, userId);

      const letter = await this.prisma.letter.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!letter) {
        throw new LetterError('Letter not found');
      }

      return this.transformToLetterResponse(letter);
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Updates a letter (owner only)
   */
  async updateLetter(id: string, userId: string, data: UpdateLetterDto): Promise<LetterResponse> {
    try {
      await this.checkLetterOwnership(id, userId);

      const updateData: any = { ...data };
      if (data.title) {
        updateData.slug = generateSlug(data.title);
      }

      const letter = await this.prisma.letter.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return this.transformToLetterResponse(letter);
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Deletes a letter (owner only)
   */
  async deleteLetter(id: string, userId: string): Promise<void> {
    try {
      await this.checkLetterOwnership(id, userId);
      await this.prisma.letter.delete({ where: { id } });
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Lists all letters owned by a user with pagination
   */
  async listMyLetters(
    userId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedLettersResponse> {
    try {
      const page = pagination.page || 1;
      const limit = pagination.limit || 20;
      const skip = (page - 1) * limit;

      const [letters, total] = await Promise.all([
        this.prisma.letter.findMany({
          where: { authorId: userId },
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        this.prisma.letter.count({
          where: { authorId: userId },
        }),
      ]);

      return {
        items: letters.map(this.transformToLetterResponse),
        total,
        page,
        limit,
        hasMore: skip + letters.length < total,
      };
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }
}

// Export singleton instance
export const letterService = new LetterService();
