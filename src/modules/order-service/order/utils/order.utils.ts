import { generateBaseId } from 'src/utils/helpers/generateBaseId';

export function generateOrderId(): string {
  return `ORD-${generateBaseId()}`;
}
