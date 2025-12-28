# Refund Scenarios - Quick Reference Guide

This guide provides practical examples of common refund scenarios and how they should be handled in the system.

---

## Scenario 1: Full Refund - Damaged Product

### Customer Situation

- Order #ORD-12345 delivered
- Product arrived damaged
- Customer wants full refund

### Request Details

```typescript
{
  orderId: "673a1b2c3d4e5f6g7h8i9j0k",
  refundType: RefundType.FULL,
  reason: RefundReason.DAMAGED_PRODUCT,
  reasonDetails: "Package was damaged during shipping. Product box is crushed and item is broken.",
  refundMethod: RefundMethod.ORIGINAL_PAYMENT,
  evidence: {
    images: [
      "https://storage.example.com/evidence/damaged-box-1.jpg",
      "https://storage.example.com/evidence/damaged-product-1.jpg"
    ],
    description: "The package arrived with visible damage. The product inside is broken and unusable."
  }
}
```

### Expected Outcome

- **Status Flow**: REQUESTED → PENDING_APPROVAL → APPROVED → PROCESSING → COMPLETED
- **Stock Restoration**: Yes (damaged items go to damaged inventory)
- **Refund Amount**: Full order amount including shipping
- **Timeline**: 3-5 business days

### Refund Calculation

```typescript
Original Order:
- Items Total: $150.00
- Shipping: $10.00
- Tax: $16.00
- Coupon Discount: -$20.00
- Payable Amount: $156.00

Refund Amount:
- Items Total: $150.00
- Shipping Refund: $10.00
- Tax Refund: $16.00
- Coupon Refund: $20.00 (coupon restored)
- Processing Fee: $0.00
- Total Refund: $176.00 (to original payment method)
```

---

## Scenario 2: Partial Refund - Wrong Item Sent

### Customer Situation

- Order #ORD-23456 with 3 items
- Received wrong item for 1 product
- Wants refund for that item only

### Request Details

```typescript
{
  orderId: "673a1b2c3d4e5f6g7h8i9j0k",
  refundType: RefundType.PARTIAL,
  reason: RefundReason.WRONG_ITEM,
  reasonDetails: "Ordered Blue T-Shirt (Size M) but received Red T-Shirt (Size L)",
  items: [
    {
      productId: "673b1c2d3e4f5g6h7i8j9k0l",
      variantSku: "TSHIRT-BLUE-M",
      quantity: 1,
      reason: "Wrong color and size received"
    }
  ],
  refundMethod: RefundMethod.WALLET,
  evidence: {
    images: ["https://storage.example.com/evidence/wrong-item.jpg"],
    description: "Received red shirt instead of blue, and size L instead of M"
  }
}
```

### Expected Outcome

- **Status Flow**: REQUESTED → PENDING_APPROVAL → APPROVED → PROCESSING → COMPLETED
- **Stock Restoration**: Yes (for correct item), No (for wrong item - return required)
- **Refund Amount**: Proportional refund for 1 item
- **Timeline**: 2-3 business days (wallet refund is faster)

### Refund Calculation

```typescript
Original Order:
- Item 1: Blue T-Shirt - $30.00
- Item 2: Jeans - $50.00
- Item 3: Shoes - $70.00
- Subtotal: $150.00
- Shipping: $10.00
- Tax: $16.00
- Total: $176.00

Partial Refund (Item 1 only):
- Item Total: $30.00
- Proportional Shipping: ($30 / $150) × $10 = $2.00
- Proportional Tax: ($30 / $150) × $16 = $3.20
- Total Refund: $35.20 (to wallet)
```

---

## Scenario 3: Multiple Partial Refunds

### Customer Situation

- Order #ORD-34567 with 5 items
- First refund: 2 items (quality issues)
- Second refund: 1 item (size doesn't fit)

### First Refund Request

```typescript
{
  orderId: "673a1b2c3d4e5f6g7h8i9j0k",
  refundType: RefundType.PARTIAL,
  reason: RefundReason.QUALITY_ISSUE,
  items: [
    { productId: "prod1", quantity: 1 },
    { productId: "prod2", quantity: 1 }
  ]
}
```

### Second Refund Request (7 days later)

```typescript
{
  orderId: "673a1b2c3d4e5f6g7h8i9j0k",
  refundType: RefundType.PARTIAL,
  reason: RefundReason.SIZE_FIT_ISSUE,
  items: [
    { productId: "prod3", quantity: 1 }
  ]
}
```

### Expected Outcome

- **Two Separate Refund Records**: #REF-11111 and #REF-22222
- **Order Tracking**:
  ```typescript
  order.refundIds = ['ref-id-1', 'ref-id-2'];
  order.totalRefundedAmount = refund1Amount + refund2Amount;
  order.hasRefund = true;
  ```

### Refund Calculations

```typescript
Original Order Total: $200.00

First Refund:
- Items: $60.00
- Proportional Shipping: $3.00
- Total: $63.00

Second Refund:
- Items: $40.00
- Proportional Shipping: $2.00
- Total: $42.00

Order After Refunds:
- Original Total: $200.00
- Total Refunded: $105.00
- Remaining Value: $95.00
- Remaining Items: 2 items
```

---

## Scenario 4: Shipping Charge Refund Only

### Customer Situation

- Order #ORD-45678 delivered late
- Customer satisfied with products
- Wants shipping charge refund as compensation

### Request Details

```typescript
{
  orderId: "673a1b2c3d4e5f6g7h8i9j0k",
  refundType: RefundType.SHIPPING,
  reason: RefundReason.LATE_DELIVERY,
  reasonDetails: "Order was supposed to arrive on Dec 20 but arrived on Dec 27. Missed Christmas gift deadline.",
  refundMethod: RefundMethod.WALLET
}
```

### Expected Outcome

- **Status Flow**: REQUESTED → PENDING_APPROVAL → APPROVED → PROCESSING → COMPLETED
- **Stock Restoration**: No
- **Refund Amount**: Shipping charge only
- **Timeline**: 1-2 business days

### Refund Calculation

```typescript
Original Order:
- Items: $100.00
- Shipping: $15.00 (Express shipping)
- Total: $115.00

Refund Amount:
- Shipping Refund: $15.00
- Total Refund: $15.00 (to wallet)
```

---

## Scenario 5: Customer Changed Mind (Within Return Window)

### Customer Situation

- Order #ORD-56789 delivered 5 days ago
- Customer changed mind, doesn't need item
- Item unopened in original packaging

### Request Details

```typescript
{
  orderId: "673a1b2c3d4e5f6g7h8i9j0k",
  refundType: RefundType.FULL,
  reason: RefundReason.CUSTOMER_CHANGED_MIND,
  reasonDetails: "Bought similar item from local store. This is still unopened.",
  refundMethod: RefundMethod.ORIGINAL_PAYMENT,
  evidence: {
    images: ["https://storage.example.com/evidence/unopened-package.jpg"],
    description: "Package is completely unopened with all seals intact"
  }
}
```

### Expected Outcome

- **Status Flow**: REQUESTED → PENDING_APPROVAL → APPROVED → PROCESSING → COMPLETED
- **Stock Restoration**: Yes (return to sellable inventory)
- **Fees Applied**: Restocking fee (10% of item value)
- **Shipping**: Customer pays return shipping, no shipping refund

### Refund Calculation

```typescript
Original Order:
- Items: $80.00
- Shipping: $8.00
- Total: $88.00

Refund Amount:
- Items Total: $80.00
- Shipping Refund: $0.00 (customer changed mind)
- Restocking Fee: -$8.00 (10% of $80)
- Total Refund: $72.00
```

---

## Scenario 6: Fraudulent Order Detected

### Admin Situation

- Order #ORD-67890 flagged as fraudulent
- Payment received but order not shipped yet
- Admin initiates full refund

### Admin Action

```typescript
// Admin creates refund directly
{
  orderId: "673a1b2c3d4e5f6g7h8i9j0k",
  refundType: RefundType.FULL,
  reason: RefundReason.FRAUDULENT_ORDER,
  reasonDetails: "Fraudulent transaction detected. Credit card reported stolen.",
  refundMethod: RefundMethod.ORIGINAL_PAYMENT,
  // Admin immediately approves
  adminAction: {
    action: 'APPROVE',
    note: 'Fraud prevention - immediate refund',
    restoreStock: true
  }
}
```

### Expected Outcome

- **Status Flow**: REQUESTED → APPROVED → PROCESSING → COMPLETED (fast-tracked)
- **Stock Restoration**: Yes (order never shipped)
- **No Fees**: Full refund
- **Order Status**: Changed to CANCELLED

### Refund Calculation

```typescript
Original Order:
- Items: $250.00
- Shipping: $20.00
- Total: $270.00

Refund Amount:
- Full Refund: $270.00
- No fees deducted
```

---

## Scenario 7: Defective Product - Partial Replacement + Partial Refund

### Customer Situation

- Order #ORD-78901 with 2 identical items
- 1 item defective, 1 item working fine
- Customer wants replacement for defective item

### Request Details

```typescript
{
  orderId: "673a1b2c3d4e5f6g7h8i9j0k",
  refundType: RefundType.PARTIAL,
  reason: RefundReason.DEFECTIVE_PRODUCT,
  reasonDetails: "One of the two headphones is not working. Left ear has no sound.",
  items: [
    {
      productId: "673b1c2d3e4f5g6h7i8j9k0l",
      quantity: 1,
      reason: "Left earphone not working"
    }
  ],
  refundMethod: RefundMethod.STORE_CREDIT,
  evidence: {
    images: ["https://storage.example.com/evidence/defective-item.jpg"],
    videos: ["https://storage.example.com/evidence/not-working.mp4"],
    description: "Video shows left earphone has no audio output"
  }
}
```

### Expected Outcome

- **Status Flow**: REQUESTED → PENDING_APPROVAL → APPROVED → PROCESSING → COMPLETED
- **Stock Restoration**: Yes (defective item marked as damaged)
- **Refund Method**: Store credit (customer can reorder)
- **Customer Action**: Can use store credit to order replacement

### Refund Calculation

```typescript
Original Order:
- Item: Headphones × 2 @ $50 each = $100.00
- Shipping: $5.00
- Total: $105.00

Partial Refund (1 item):
- Item Total: $50.00
- Proportional Shipping: ($50 / $100) × $5 = $2.50
- Total Store Credit: $52.50
```

---

## Scenario 8: Refund Rejection - Outside Return Window

### Customer Situation

- Order #ORD-89012 delivered 45 days ago
- Customer wants refund for quality issue
- Return policy: 30 days

### Request Details

```typescript
{
  orderId: "673a1b2c3d4e5f6g7h8i9j0k",
  refundType: RefundType.FULL,
  reason: RefundReason.QUALITY_ISSUE,
  reasonDetails: "Product quality is not good. Stitching is coming apart.",
  refundMethod: RefundMethod.ORIGINAL_PAYMENT
}
```

### Admin Action

```typescript
{
  action: 'REJECT',
  rejectionReason: "Refund request is outside the 30-day return window. Order was delivered 45 days ago.",
  note: "Offered customer 20% discount coupon for next purchase as goodwill gesture"
}
```

### Expected Outcome

- **Status Flow**: REQUESTED → PENDING_APPROVAL → REJECTED
- **Stock Restoration**: No
- **Refund Amount**: $0.00
- **Customer Notification**: Email with rejection reason and alternative solution

---

## Scenario 9: Payment Gateway Failure

### Situation

- Refund approved and processing
- Payment gateway returns error
- Manual intervention required

### Initial Request

```typescript
{
  orderId: "673a1b2c3d4e5f6g7h8i9j0k",
  refundType: RefundType.FULL,
  reason: RefundReason.DAMAGED_PRODUCT,
  refundMethod: RefundMethod.ORIGINAL_PAYMENT
}
```

### Gateway Response

```typescript
{
  gateway: "stripe",
  status: "failed",
  error: "insufficient_funds_in_merchant_account",
  rawResponse: {
    error: {
      code: "insufficient_funds",
      message: "Merchant account has insufficient funds for refund"
    }
  }
}
```

### Expected Outcome

- **Status Flow**: REQUESTED → APPROVED → PROCESSING → FAILED
- **Admin Notification**: Alert sent to admin for manual processing
- **Refund Record**:
  ```typescript
  {
    status: RefundStatus.FAILED,
    failureReason: "Payment gateway error: insufficient funds in merchant account",
    paymentGatewayResponse: { /* gateway response */ }
  }
  ```

### Resolution

1. Admin investigates gateway issue
2. Admin processes refund manually via bank transfer
3. Admin updates refund status to COMPLETED
4. Admin adds note: "Processed manually via bank transfer due to gateway issue"

---

## Scenario 10: Wallet + Original Payment Refund

### Customer Situation

- Order #ORD-90123 paid using:
  - Wallet: $30.00
  - Credit Card: $70.00
- Full refund requested

### Request Details

```typescript
{
  orderId: "673a1b2c3d4e5f6g7h8i9j0k",
  refundType: RefundType.FULL,
  reason: RefundReason.NOT_AS_DESCRIBED,
  refundMethod: RefundMethod.ORIGINAL_PAYMENT
}
```

### Expected Outcome

- **Split Refund**:
  - $30.00 → User Wallet
  - $70.00 → Credit Card

### Refund Calculation

```typescript
Original Payment:
- Wallet: $30.00
- Credit Card: $70.00
- Total: $100.00

Refund Distribution:
- Wallet Refund: $30.00
- Credit Card Refund: $70.00

Refund Record:
{
  refundAmount: {
    walletRefund: 30.00,
    totalRefundAmount: 100.00
  },
  paymentGatewayResponse: {
    gateway: "stripe",
    refundId: "re_1234567890",
    status: "succeeded",
    // Only $70 processed through gateway
  }
}
```

---

## Scenario 11: Bulk Refund - Product Recall

### Admin Situation

- Product #PROD-12345 recalled due to safety issue
- 150 orders containing this product
- Admin needs to refund all affected orders

### Admin Action

```typescript
// Admin uses bulk refund feature
{
  productId: "673b1c2d3e4f5g6h7i8j9k0l",
  reason: RefundReason.DEFECTIVE_PRODUCT,
  reasonDetails: "Product recall due to safety concerns. Automatic refund initiated.",
  refundType: RefundType.PARTIAL, // Only this product
  autoApprove: true,
  restoreStock: false, // Recalled items destroyed
  notifyCustomers: true
}
```

### Expected Outcome

- **150 Refund Records Created**: All with status APPROVED
- **Batch Processing**: Refunds processed in batches of 10
- **Customer Notifications**: Automated emails sent
- **Admin Report**: Summary of all refunds generated

### Processing

```typescript
// For each affected order
for (const order of affectedOrders) {
  const refund = await createRefund({
    orderId: order._id,
    refundType: RefundType.PARTIAL,
    items: [{ productId: recalledProductId, quantity: orderedQuantity }],
    reason: RefundReason.DEFECTIVE_PRODUCT,
    status: RefundStatus.APPROVED, // Auto-approved
  });

  await processRefund(refund._id);
}
```

---

## Scenario 12: Coupon-Only Order Refund

### Customer Situation

- Order #ORD-01234 paid entirely with coupon
- Order value: $50.00
- Coupon discount: $50.00
- Paid amount: $0.00

### Request Details

```typescript
{
  orderId: "673a1b2c3d4e5f6g7h8i9j0k",
  refundType: RefundType.FULL,
  reason: RefundReason.CUSTOMER_CHANGED_MIND,
  refundMethod: RefundMethod.WALLET
}
```

### Expected Outcome

- **No Monetary Refund**: $0.00 to wallet
- **Coupon Restored**: Original coupon made available again
- **Order Status**: Changed to CANCELLED

### Refund Calculation

```typescript
Original Order:
- Items: $50.00
- Coupon Discount: -$50.00
- Paid Amount: $0.00

Refund Amount:
- Items Total: $50.00
- Coupon Refund: $50.00
- Total Monetary Refund: $0.00
- Coupon Restored: Yes (coupon code reactivated)
```

---

## Common Refund Rules Summary

| Scenario          | Shipping Refund  | Restocking Fee | Stock Restoration | Timeline  |
| ----------------- | ---------------- | -------------- | ----------------- | --------- |
| Damaged Product   | ✅ Yes           | ❌ No          | ✅ Yes (damaged)  | 3-5 days  |
| Wrong Item        | ✅ Yes           | ❌ No          | ⚠️ Partial        | 3-5 days  |
| Defective Product | ✅ Yes           | ❌ No          | ✅ Yes (damaged)  | 3-5 days  |
| Not as Described  | ✅ Yes           | ❌ No          | ✅ Yes            | 3-5 days  |
| Quality Issue     | ✅ Yes           | ❌ No          | ✅ Yes            | 3-5 days  |
| Size/Fit Issue    | ⚠️ Partial       | ⚠️ Maybe (5%)  | ✅ Yes            | 5-7 days  |
| Late Delivery     | ⚠️ Shipping only | ❌ No          | ❌ No             | 1-2 days  |
| Changed Mind      | ❌ No            | ✅ Yes (10%)   | ✅ Yes            | 7-10 days |
| Duplicate Order   | ✅ Yes           | ❌ No          | ✅ Yes            | 3-5 days  |
| Fraudulent Order  | ✅ Yes           | ❌ No          | ✅ Yes            | 1-3 days  |

---

## Refund Timeline by Method

| Refund Method             | Processing Time   | Notes                  |
| ------------------------- | ----------------- | ---------------------- |
| Wallet                    | 1-2 business days | Fastest option         |
| Original Payment (Card)   | 3-5 business days | Depends on bank        |
| Original Payment (PayPal) | 2-3 business days | Usually faster         |
| Bank Transfer             | 5-7 business days | Manual processing      |
| Store Credit              | Instant           | Immediate availability |

---

## Best Practices

### For Customers

1. **Provide Evidence**: Upload clear photos/videos
2. **Detailed Description**: Explain the issue clearly
3. **Original Packaging**: Keep items in original condition
4. **Timely Request**: Submit within return window
5. **Track Status**: Monitor refund progress

### For Admins

1. **Quick Response**: Review requests within 24 hours
2. **Fair Assessment**: Evaluate evidence objectively
3. **Clear Communication**: Provide detailed rejection reasons
4. **Fraud Detection**: Watch for suspicious patterns
5. **Customer Satisfaction**: Prioritize customer experience

### For Developers

1. **Validation**: Validate all refund calculations
2. **Idempotency**: Ensure refund operations are idempotent
3. **Error Handling**: Handle gateway failures gracefully
4. **Audit Trail**: Log all actions and changes
5. **Testing**: Test all scenarios thoroughly
