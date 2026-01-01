import { ClientSession } from 'mongoose';

export enum InventoryTransactionType {
  INITIAL = 'INITIAL',
  RESTOCK = 'RESTOCK',
  SALE = 'SALE',
  RETURN = 'RETURN',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
  DAMAGED = 'DAMAGED',
  EXPIRED = 'EXPIRED',
}

export interface IInventoryAdjustEvent {
  productId: string;
  quantity: number; // -ve for sale
  type: InventoryTransactionType;
  variantSku?: string;
  referenceId?: string; // orderId
  reason?: string;
  session?: ClientSession;
}

export class InventoryAdjustEvent {
  public readonly productId: string;
  public readonly quantity: number;
  public readonly type: InventoryTransactionType;
  public readonly variantSku?: string;
  public readonly referenceId?: string;
  public readonly reason?: string;
  public readonly session?: ClientSession;

  constructor(params: IInventoryAdjustEvent) {
    this.productId = params.productId;
    this.quantity = params.quantity;
    this.type = params.type;
    this.variantSku = params.variantSku;
    this.referenceId = params.referenceId;
    this.reason = params.reason;
    this.session = params.session;
  }
}

export const InventoryEvents = {
  ADJUST_STOCK: 'inventory.adjust-stock',
};
