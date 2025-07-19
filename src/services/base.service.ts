import { PrismaClient } from '@prisma/client';
import { generateId } from '../utils/uuid';

/**
 * Base service class that provides common functionality
 * for database operations and resource management
 */
export abstract class BaseService {
  protected readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      // Log queries only in development
      log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
    });
  }

  /**
   * Generates a new UUIDv7 for entity creation
   */
  protected generateEntityId(): string {
    return generateId();
  }

  /**
   * Cleanup method to be called when service is no longer needed
   * Important for proper resource management in serverless environments
   */
  async cleanup(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
