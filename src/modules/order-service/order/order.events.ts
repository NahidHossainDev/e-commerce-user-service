export enum OrderEvents {
  ORDER_CREATED = 'order.created',
  ORDER_CANCELLED = 'order.cancelled',
  ORDER_SHIPPED = 'order.shipped',
  ORDER_DELIVERED = 'order.delivered',
  ORDER_STATUS_UPDATED = 'order.status_updated',
}

export interface OrderItemPayload {
  productId: string;
  name: string;
  variantSku?: string;
  quantity: number;
}

export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  items: OrderItemPayload[];
  totalAmount: number;
  payableAmount: number;
  timestamp: Date;
}

export interface OrderCancelledEvent {
  orderId: string;
  reason: string;
  timestamp: Date;
}
