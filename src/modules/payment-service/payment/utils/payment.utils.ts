import { v4 as uuidv4 } from 'uuid';

export class PaymentUtils {
  static generateTransactionId(): string {
    // Generates a unique transaction ID like TXN-1704223456789-A1B2C
    const timestamp = Date.now();
    const uniquePart = uuidv4().split('-')[0].toUpperCase();
    return `TXN-${timestamp}-${uniquePart}`;
  }
}
