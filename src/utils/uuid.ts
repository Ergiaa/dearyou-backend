import { uuidv7 } from 'uuidv7';

/**
 * Generates a new UUIDv7 string
 * UUIDv7 provides:
 * 1. Time-sortable UUIDs (first 48 bits are timestamp)
 * 2. Guaranteed uniqueness through random bits
 * 3. Standard UUID format compatible with PostgreSQL UUID type
 */
export const generateId = (): string => {
  return uuidv7();
};

/**
 * Validates if a string is a valid UUID
 * @param id - The string to validate
 */
export const isValidUuid = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Extracts the timestamp from a UUIDv7
 * @param uuid - The UUIDv7 string
 * @returns Date object representing the timestamp
 */
export const getTimestampFromUuid = (uuid: string): Date => {
  if (!isValidUuid(uuid)) {
    throw new Error('Invalid UUIDv7 format');
  }

  // Remove hyphens and convert to binary
  const binary = BigInt(`0x${uuid.replace(/-/g, '')}`);

  // Extract timestamp (first 48 bits)
  const timestamp = Number(binary >> BigInt(80));

  return new Date(timestamp);
};
