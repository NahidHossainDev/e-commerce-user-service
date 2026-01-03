import { generateBaseId } from 'src/utils/helpers/generateBaseId';

export function generateRefundId(): string {
  return `REF-${generateBaseId()}`;
}
