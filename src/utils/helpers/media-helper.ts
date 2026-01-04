import * as path from 'path';

/**
 * Extracts a media ID (UUID) from a media URL.
 * Assumes the ID is the filename without extension.
 * Example: https://pub-xxxx.r2.dev/tmp/images/550e8400-e29b-41d4-a716-446655440000.webp
 * Returns: 550e8400-e29b-41d4-a716-446655440000
 */
export function extractMediaIdFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const filename = url.split('/').pop();
    if (!filename) return null;
    return path.parse(filename).name;
  } catch {
    return null;
  }
}
