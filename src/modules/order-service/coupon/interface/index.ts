export interface ICouponUsagePayload {
  couponId: string;
  userId: string;
  orderId: string;
  orderCode?: string;
  discountAmount: number;
}

