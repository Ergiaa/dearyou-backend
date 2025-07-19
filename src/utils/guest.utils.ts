import { nanoid } from 'nanoid';
import { createHash } from 'crypto';

/**
 * Generates a guest token pair for letter management
 * guestId: Used for querying letters (32 chars)
 * guestToken: Used for authentication (64 chars)
 */
export function generateGuestTokens(): { guestId: string; guestToken: string } {
  const guestId = nanoid(32);

  // Create a token by hashing the guestId with a timestamp
  const timestamp = Date.now().toString();
  const guestToken = createHash('sha256').update(`${guestId}:${timestamp}`).digest('hex');

  return { guestId, guestToken };
}
