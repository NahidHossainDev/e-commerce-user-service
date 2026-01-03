import { generateBaseId } from 'src/utils/helpers/generateBaseId';

export function generateTransactionId(): string {
  return `TNX-${generateBaseId()}`;
}
