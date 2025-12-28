# Order Refund Schema Documentation

## Overview

This document describes the comprehensive refund management system for the e-commerce platform. The refund schema supports full and partial refunds, tracks the complete refund lifecycle, integrates with payment gateways, and maintains detailed audit trails.

## Schema Files

- **Refund Schema**: [`refund.schema.ts`](file:///home/nahid-hossain/WebDev/Personal%20Projects/e-commerce/e-commerce-user-service/src/modules/order-service/order/schemas/refund.schema.ts)
- **Refund DTOs**: [`refund.dto.ts`](file:///home/nahid-hossain/WebDev/Personal%20Projects/e-commerce/e-commerce-user-service/src/modules/order-service/order/dto/refund.dto.ts)
- **Order Schema**: [`order.schema.ts`](file:///home/nahid-hossain/WebDev/Personal%20Projects/e-commerce/e-commerce-user-service/src/modules/order-service/order/schemas/order.schema.ts) (updated with refund tracking)

---

## Refund Schema Structure

### Core Fields

| Field           | Type           | Description                                 |
| --------------- | -------------- | ------------------------------------------- |
| `refundId`      | `string`       | Unique human-readable ID (e.g., #REF-12345) |
| `orderId`       | `ObjectId`     | Reference to the original order             |
| `orderNumber`   | `string`       | Human-readable order ID for easy reference  |
| `userId`        | `ObjectId`     | User who requested the refund               |
| `refundType`    | `RefundType`   | FULL, PARTIAL, or SHIPPING                  |
| `status`        | `RefundStatus` | Current refund status                       |
| `reason`        | `RefundReason` | Primary reason for refund                   |
| `reasonDetails` | `string`       | Additional details about the reason         |

---

## Enums

### RefundStatus

Tracks the complete lifecycle of a refund request:

```typescript
enum RefundStatus {
  REQUESTED = 'REQUESTED', // Customer submitted refund request
  PENDING_APPROVAL = 'PENDING_APPROVAL', // Awaiting admin review
  APPROVED = 'APPROVED', // Admin approved the refund
  REJECTED = 'REJECTED', // Admin rejected the refund
  PROCESSING = 'PROCESSING', // Payment gateway processing
  COMPLETED = 'COMPLETED', // Refund successfully completed
  FAILED = 'FAILED', // Refund processing failed
  CANCELLED = 'CANCELLED', // Customer cancelled the request
}
```

**Status Flow**:

```
REQUESTED → PENDING_APPROVAL → APPROVED → PROCESSING → COMPLETED
                            ↓
                        REJECTED
                            ↓
                        CANCELLED (at any stage)
                            ↓
                        FAILED (during PROCESSING)
```

### RefundType

```typescript
enum RefundType {
  FULL = 'FULL', // Refund entire order
  PARTIAL = 'PARTIAL', // Refund specific items
  SHIPPING = 'SHIPPING', // Refund shipping charges only
}
```

### RefundReason

```typescript
enum RefundReason {
  DAMAGED_PRODUCT = 'DAMAGED_PRODUCT',
  WRONG_ITEM = 'WRONG_ITEM',
  DEFECTIVE_PRODUCT = 'DEFECTIVE_PRODUCT',
  NOT_AS_DESCRIBED = 'NOT_AS_DESCRIBED',
  QUALITY_ISSUE = 'QUALITY_ISSUE',
  SIZE_FIT_ISSUE = 'SIZE_FIT_ISSUE',
  LATE_DELIVERY = 'LATE_DELIVERY',
  CUSTOMER_CHANGED_MIND = 'CUSTOMER_CHANGED_MIND',
  DUPLICATE_ORDER = 'DUPLICATE_ORDER',
  FRAUDULENT_ORDER = 'FRAUDULENT_ORDER',
  OTHER = 'OTHER',
}
```

### RefundMethod

```typescript
enum RefundMethod {
  ORIGINAL_PAYMENT = 'ORIGINAL_PAYMENT', // Refund to original payment method
  WALLET = 'WALLET', // Refund to user wallet
  BANK_TRANSFER = 'BANK_TRANSFER', // Direct bank transfer
  STORE_CREDIT = 'STORE_CREDIT', // Store credit/voucher
}
```

---

## Nested Schemas

### RefundItem

For partial refunds, tracks individual items being refunded:

```typescript
{
  productId: ObjectId,      // Product reference
  name: string,             // Product name (snapshot)
  variantSku?: string,      // Variant SKU if applicable
  quantity: number,         // Quantity to refund
  unitPrice: number,        // Price per unit
  totalAmount: number,      // quantity × unitPrice
  reason?: string,          // Item-specific reason
}
```

### RefundAmount

Detailed breakdown of refund calculations:

```typescript
{
  itemsTotal: number,         // Total for refunded items
  shippingRefund: number,     // Shipping charge refund
  taxRefund: number,          // Tax refund
  couponRefund: number,       // Coupon discount reversal
  walletRefund: number,       // Wallet cash refund
  processingFee: number,      // Processing fee deduction
  restockingFee: number,      // Restocking fee deduction
  totalRefundAmount: number,  // Final refund amount
  currency: string,           // Currency code
}
```

**Calculation**:

```
totalRefundAmount = itemsTotal + shippingRefund + taxRefund + couponRefund + walletRefund
                    - processingFee - restockingFee
```

### RefundEvidence

Customer-provided proof for refund request:

```typescript
{
  images: string[],       // Image URLs
  videos: string[],       // Video URLs
  description: string,    // Detailed description
  documents: string[],    // Supporting documents
}
```

### RefundTimeline

Tracks all important timestamps:

```typescript
{
  requestedAt: Date,           // When refund was requested
  approvedAt?: Date,           // When admin approved
  rejectedAt?: Date,           // When admin rejected
  processingStartedAt?: Date,  // When payment processing started
  completedAt?: Date,          // When refund completed
  failedAt?: Date,             // When refund failed
  cancelledAt?: Date,          // When refund was cancelled
}
```

### AdminAction

Audit trail of all admin actions:

```typescript
{
  adminId: ObjectId,    // Admin who performed action
  action: string,       // Action type (APPROVED, REJECTED, etc.)
  note?: string,        // Admin's comment
  timestamp: Date,      // When action was performed
}
```

### PaymentGatewayResponse

Integration with payment gateways:

```typescript
{
  gateway: string,              // Gateway name (stripe, paypal, etc.)
  transactionId?: string,       // Original transaction ID
  refundId?: string,            // Gateway refund ID
  status?: string,              // Gateway status
  rawResponse?: object,         // Full gateway response
  timestamp: Date,              // Response timestamp
}
```

---

## Additional Tracking Fields

| Field              | Type      | Description                    |
| ------------------ | --------- | ------------------------------ |
| `rejectionReason`  | `string`  | Why refund was rejected        |
| `failureReason`    | `string`  | Why refund processing failed   |
| `isStockRestored`  | `boolean` | Whether inventory was restored |
| `stockRestoredAt`  | `Date`    | When stock was restored        |
| `isCouponRestored` | `boolean` | Whether coupon was restored    |
| `couponRestoredAt` | `Date`    | When coupon was restored       |
| `metadata`         | `object`  | Additional custom data         |
| `internalNotes`    | `string`  | Staff-only notes               |

---

## Database Indexes

Optimized for common query patterns:

```typescript
// Time-based queries
{ createdAt: -1 }
{ 'timeline.requestedAt': -1 }

// Unique identifier
{ refundId: 1 } (unique)

// Relationship queries
{ orderId: 1, status: 1 }
{ userId: 1, status: 1 }

// Status filtering
{ status: 1, createdAt: -1 }
```

---

## Order Schema Updates

The Order schema has been enhanced with refund tracking:

```typescript
{
  hasRefund: boolean,              // Quick flag for refund existence
  refundIds: ObjectId[],           // Array of refund references
  totalRefundedAmount: number,     // Total refunded across all refunds
  refundedAt: Date,                // When order was refunded
  returnReason: string,            // Return reason
}
```

---

## Refund Workflow

### 1. Customer Initiates Refund

**DTO**: `CreateRefundRequestDto`

```typescript
{
  orderId: string,
  refundType: RefundType,
  reason: RefundReason,
  reasonDetails?: string,
  items?: RefundItemDto[],      // Required for PARTIAL
  refundMethod?: RefundMethod,
  evidence?: RefundEvidenceDto,
}
```

**Actions**:

- Validate order exists and belongs to user
- Validate order status allows refund
- For PARTIAL refunds, validate items exist in order
- Calculate refund amounts
- Create refund record with status `REQUESTED`
- Update order's `hasRefund` flag

### 2. Admin Reviews Refund

**DTO**: `AdminRefundActionDto`

```typescript
{
  action: 'APPROVE' | 'REJECT',
  note?: string,
  rejectionReason?: string,     // Required if REJECT
  restoreStock?: boolean,
  restoreCoupon?: boolean,
}
```

**Actions**:

- Admin reviews evidence and details
- If APPROVED:
  - Update status to `APPROVED`
  - Record admin action
  - Optionally restore stock
  - Optionally restore coupon
- If REJECTED:
  - Update status to `REJECTED`
  - Record rejection reason
  - Notify customer

### 3. Process Refund Payment

**DTO**: `ProcessRefundDto`

```typescript
{
  processingFee?: number,
  restockingFee?: number,
  note?: string,
}
```

**Actions**:

- Update status to `PROCESSING`
- Apply any fees
- Recalculate final refund amount
- Initiate payment gateway refund
- Store gateway response
- Update status to `COMPLETED` or `FAILED`

### 4. Complete Refund

**Final Actions**:

- Update order's `refundIds` array
- Update order's `totalRefundedAmount`
- Update order status if fully refunded
- Send confirmation to customer
- Update payment status in order

---

## API Endpoints (Suggested)

### Customer Endpoints

```
POST   /api/private/refunds              - Create refund request
GET    /api/private/refunds              - Get user's refunds
GET    /api/private/refunds/:id          - Get refund details
DELETE /api/private/refunds/:id          - Cancel refund request
```

### Admin Endpoints

```
GET    /api/admin/refunds                - Get all refunds (with filters)
GET    /api/admin/refunds/:id            - Get refund details
PATCH  /api/admin/refunds/:id/approve    - Approve refund
PATCH  /api/admin/refunds/:id/reject     - Reject refund
PATCH  /api/admin/refunds/:id/process    - Process refund payment
PATCH  /api/admin/refunds/:id/status     - Update refund status
POST   /api/admin/refunds/:id/notes      - Add internal note
```

---

## Business Rules

### Refund Eligibility

1. **Time Limits**:
   - Standard products: 30 days from delivery
   - Electronics: 14 days from delivery
   - Custom/personalized items: Non-refundable

2. **Order Status**:
   - Must be DELIVERED or SHIPPED
   - Cannot refund CANCELLED orders
   - Cannot refund already REFUNDED orders

3. **Item Condition**:
   - Must be unused/unopened (for change of mind)
   - Damaged items: Evidence required
   - Wrong items: Evidence required

### Refund Amount Calculation

```typescript
// Full Refund
totalRefund = billingInfo.payableAmount - processingFee - restockingFee;

// Partial Refund
itemsTotal = sum(refundItems.map((item) => item.totalAmount));
proportionalShipping = (itemsTotal / orderTotal) * shippingCharge;
proportionalTax = (itemsTotal / orderTotal) * taxAmount;
totalRefund = itemsTotal + proportionalShipping + proportionalTax - fees;
```

### Stock Restoration

- Restore stock when refund is APPROVED
- Only for physical products
- Update product inventory
- Log inventory transaction

### Coupon Restoration

- Restore coupon if:
  - Full refund
  - Coupon was single-use
  - Coupon hasn't expired
- Mark coupon as available again

---

## Integration Points

### 1. Order Service

- Validate order status
- Update order refund tracking
- Update payment status

### 2. Inventory Service

- Restore stock quantities
- Log inventory adjustments

### 3. Payment Service

- Process refund through gateway
- Handle payment method-specific logic
- Track transaction status

### 4. Coupon Service

- Restore coupon availability
- Update usage count

### 5. Notification Service

- Send refund request confirmation
- Notify on approval/rejection
- Send refund completion notification

### 6. Wallet Service

- Credit wallet if refund method is WALLET
- Create wallet transaction record

---

## Error Handling

### Common Errors

```typescript
// Order not found
throw new NotFoundException('Order not found');

// Order not eligible for refund
throw new BadRequestException('Order cannot be refunded');

// Refund already exists
throw new ConflictException('Refund request already exists');

// Invalid refund items
throw new BadRequestException('Invalid items for refund');

// Payment gateway error
throw new InternalServerException('Refund processing failed');
```

---

## Testing Scenarios

### 1. Full Refund Flow

- Customer requests full refund
- Admin approves
- Payment gateway processes
- Stock restored
- Order status updated

### 2. Partial Refund Flow

- Customer requests refund for 2 of 5 items
- Calculate proportional amounts
- Process partial refund
- Restore stock for refunded items only

### 3. Multiple Partial Refunds

- Customer requests refund for item A
- Later requests refund for item B
- Track multiple refund records
- Update total refunded amount

### 4. Rejection Flow

- Customer requests refund
- Admin rejects with reason
- Customer notified
- No stock restoration

### 5. Failed Refund

- Refund approved
- Payment gateway fails
- Status updated to FAILED
- Admin notified for manual intervention

---

## Performance Considerations

1. **Indexes**: Ensure all query patterns are indexed
2. **Pagination**: Always paginate refund lists
3. **Caching**: Cache refund statistics
4. **Async Processing**: Process payment gateway calls asynchronously
5. **Batch Operations**: Batch stock restoration for multiple items

---

## Security Considerations

1. **Authorization**:
   - Users can only view/create their own refunds
   - Admins can view/manage all refunds
   - Validate ownership before any operation

2. **Evidence Validation**:
   - Validate file types and sizes
   - Scan for malware
   - Store in secure cloud storage

3. **Audit Trail**:
   - Log all admin actions
   - Track IP addresses
   - Maintain immutable history

4. **Fraud Prevention**:
   - Rate limit refund requests
   - Flag suspicious patterns
   - Require evidence for high-value refunds

---

## Future Enhancements

1. **Automated Approval**:
   - Auto-approve low-value refunds
   - ML-based fraud detection
   - Risk scoring system

2. **Return Shipping**:
   - Generate return labels
   - Track return shipments
   - Verify item condition on receipt

3. **Partial Payments**:
   - Support split refunds
   - Refund to multiple methods
   - Installment refunds

4. **Analytics**:
   - Refund rate by product
   - Common refund reasons
   - Processing time metrics
   - Gateway success rates

---

## Summary

This refund schema provides:

✅ **Complete Lifecycle Tracking** - From request to completion  
✅ **Flexible Refund Types** - Full, partial, and shipping refunds  
✅ **Detailed Audit Trail** - All actions and timestamps recorded  
✅ **Payment Gateway Integration** - Ready for multiple gateways  
✅ **Evidence Management** - Support for images, videos, documents  
✅ **Business Logic Support** - Fees, stock restoration, coupon handling  
✅ **Scalable Architecture** - Indexed for performance  
✅ **Security & Compliance** - Authorization and audit trails

The schema is production-ready and follows e-commerce best practices for refund management.
