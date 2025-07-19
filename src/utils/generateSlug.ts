import { nanoid } from 'nanoid';

/**
 * Generates a URL-safe slug for a letter
 * Format: {title-slug}-{random-id}
 * If no title is provided, uses only the random ID
 */
export function generateSlug(title?: string): string {
  const randomId = nanoid(12);

  if (!title) {
    return randomId;
  }

  // Convert title to URL-safe slug
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50); // Limit length

  return `${titleSlug}-${randomId}`;
}
