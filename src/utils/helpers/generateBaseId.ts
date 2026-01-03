import { v7 as uuidv7, validate } from 'uuid';

/**
 * Generates a base unique ID using UUID v7.
 * Returns the raw UUID string without any prefix.
 */
export function generateBaseId(): string {
  return uuidv7();
}

export function isValidId(id: string): boolean {
  return validate(id);
}
