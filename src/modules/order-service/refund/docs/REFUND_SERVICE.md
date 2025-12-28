# Refund Service - Method Documentation

## Overview

The `RefundService` provides comprehensive refund management functionality with complete CRUD operations, business logic validation, payment processing, and integration with other services.

---

## Customer Methods

### 1. `createRefundRequest(userId, dto)`

**Purpose**: Create a new refund request

**Parameters**:

- `userId: string` - User ID making the request
- `dto: CreateRefundRequestDto` - Refund request details

**Validations**:

- ✅ Order exists and belongs to user
- ✅ Order is eligible for refund (status, time window)
- ✅ No existing active refund
- ✅ Items validation for partial refunds
- ✅ Evidence requirements based on reason
- ✅ User refund limits (monthly count and amount)

**Process**:

1. Validate order ownership
2. Check refund eligibility
3. Validate refund items (if partial)
4. Check evidence requirements
5. Calculate refund amount
6. Generate unique refund ID
7. Create refund record
8. Update order with refund flag
9. Emit refund requested event
10. Auto-transition to PENDING_APPROVAL

**Returns**: `RefundDocument`

---

### 2. `getUserRefunds(userId, query)`

**Purpose**: Get all refunds for a specific user

**Parameters**:

- `userId: string` - User ID
- `query: RefundQueryDto` - Filter and pagination options

**Features**:

- Filter by status, type, reason, order
- Search by refund ID or order number
- Pagination support
- Sorting options

**Returns**: `{ refunds: RefundDocument[], total: number }`

---

### 3. `getRefundById(refundId, userId?)`

**Purpose**: Get detailed information about a specific refund

**Parameters**:

- `refundId: string` - Refund ID
- `userId?: string` - Optional user ID for ownership verification

**Validations**:

- ✅ Refund exists
- ✅ User owns refund (if userId provided)

**Returns**: `RefundDocument`

---

### 4. `cancelRefundRequest(refundId, userId, dto)`

**Purpose**: Cancel a pending refund request

**Parameters**:

- `refundId: string` - Refund ID
- `userId: string` - User ID
- `dto: CancelRefundRequestDto` - Cancellation details

**Validations**:

- ✅ Refund exists and belongs to user
- ✅ Status is REQUESTED or PENDING_APPROVAL

**Process**:

1. Verify ownership
2. Check cancellable status
3. Update status to CANCELLED
4. Record cancellation timestamp and reason
5. Emit cancellation event

**Returns**: `RefundDocument`

---

## Admin Methods

### 5. `getAllRefunds(query)`

**Purpose**: Get all refunds with filtering (admin only)

**Parameters**:

- `query: RefundQueryDto` - Filter and pagination options

**Features**:

- Filter by user, order, status, type, reason
- Search functionality
- Pagination and sorting
- Populates user and order details

**Returns**: `{ refunds: RefundDocument[], total: number }`

---

### 6. `adminRefundAction(refundId, adminId, dto)`

**Purpose**: Approve or reject a refund request

**Parameters**:

- `refundId: string` - Refund ID
- `adminId: string` - Admin user ID
- `dto: AdminRefundActionDto` - Action details

**Validations**:

- ✅ Refund exists
- ✅ Status is PENDING_APPROVAL

**Process (APPROVE)**:

1. Update status to APPROVED
2. Record approval timestamp
3. Restore stock (if requested)
4. Restore coupon (if requested)
5. Record admin action
6. Emit approval event

**Process (REJECT)**:

1. Validate rejection reason provided
2. Update status to REJECTED
3. Record rejection timestamp and reason
4. Record admin action
5. Emit rejection event

**Transaction**: Uses MongoDB session for atomicity

**Returns**: `RefundDocument`

---

### 7. `processRefund(refundId, adminId, dto)`

**Purpose**: Process the actual refund payment

**Parameters**:

- `refundId: string` - Refund ID
- `adminId: string` - Admin user ID
- `dto: ProcessRefundDto` - Processing details (fees)

**Validations**:

- ✅ Refund exists
- ✅ Status is APPROVED

**Process**:

1. Apply processing/restocking fees
2. Recalculate total refund amount
3. Update status to PROCESSING
4. Record admin action
5. Call payment gateway
6. Handle gateway response:
   - **Success**: Update to COMPLETED, update order, emit completion event
   - **Failure**: Update to FAILED, record error, emit failure event
7. Store gateway response

**Transaction**: Uses MongoDB session for atomicity

**Returns**: `RefundDocument`

---

### 8. `updateRefundStatus(refundId, adminId, dto)`

**Purpose**: Manually update refund status

**Parameters**:

- `refundId: string` - Refund ID
- `adminId: string` - Admin user ID
- `dto: UpdateRefundStatusDto` - New status and notes

**Validations**:

- ✅ Refund exists
- ✅ Status transition is valid

**Process**:

1. Validate status transition
2. Update status
3. Update timeline based on new status
4. Record admin action
5. Save changes

**Returns**: `RefundDocument`

---

### 9. `addInternalNote(refundId, adminId, dto)`

**Purpose**: Add internal staff notes to refund

**Parameters**:

- `refundId: string` - Refund ID
- `adminId: string` - Admin user ID
- `dto: AddRefundNoteDto` - Note content

**Process**:

1. Append timestamped note
2. Record admin action
3. Save changes

**Returns**: `RefundDocument`

---

## Helper Methods

### 10. `validateOrderOwnership(orderId, userId)`

**Purpose**: Verify order exists and belongs to user

**Throws**:

- `NotFoundException` - Order not found
- `UnauthorizedException` - User doesn't own order

**Returns**: `OrderDocument`

---

### 11. `validateRefundEligibility(order)`

**Purpose**: Check if order is eligible for refund

**Checks**:

- Order status is refundable
- Within refund window (30 days default)

**Throws**:

- `BadRequestException` - Order not eligible or window expired

---

### 12. `checkExistingRefund(orderId)`

**Purpose**: Ensure no active refund exists for order

**Throws**:

- `ConflictException` - Active refund already exists

---

### 13. `validateRefundItems(refundItems, order)`

**Purpose**: Validate items for partial refund

**Checks**:

- All items exist in order
- Quantities don't exceed ordered amounts

**Throws**:

- `BadRequestException` - Invalid items or quantities

---

### 14. `checkUserRefundLimits(userId)`

**Purpose**: Enforce monthly refund limits

**Checks**:

- Monthly refund count < 5
- Monthly refund amount < $5000

**Throws**:

- `BadRequestException` - Limit exceeded

---

### 15. `calculateRefundAmount(order, dto)`

**Purpose**: Calculate refund breakdown

**Logic**:

**Full Refund**:

```typescript
itemsTotal = order.totalAmount;
shippingRefund = order.deliveryCharge;
couponRefund = order.couponDiscount;
walletRefund = order.walletCashApplied;
```

**Partial Refund**:

```typescript
itemsTotal = Σ(item.total × refundQty/orderedQty)
shippingRefund = (itemsTotal/orderTotal) × deliveryCharge
```

**Shipping Only**:

```typescript
shippingRefund = order.deliveryCharge;
```

**Returns**: `RefundAmount`

---

### 16. `calculateTotalRefundAmount(refundAmount)`

**Purpose**: Calculate final refund with fees

**Formula**:

```typescript
total =
  itemsTotal +
  shippingRefund +
  taxRefund +
  couponRefund +
  walletRefund -
  processingFee -
  restockingFee;
```

**Returns**: `number`

---

### 17. `generateUniqueRefundId()`

**Purpose**: Generate unique refund ID

**Format**: `REF-12345678` (8 random digits)

**Returns**: `string`

---

### 18. `restoreStock(refund, session)`

**Purpose**: Restore inventory after refund approval

**Logic**:

- Determines if stock goes to sellable or damaged inventory
- Emits event for inventory service
- Updates refund flags

**Integration**: Event-driven with inventory service

---

### 19. `restoreCoupon(refund, session)`

**Purpose**: Restore coupon availability

**Conditions**:

- Only for full refunds
- Emits event for coupon service
- Updates refund flags

**Integration**: Event-driven with coupon service

---

### 20. `processPaymentGatewayRefund(refund)`

**Purpose**: Process refund through payment gateway

**Handles**:

- Wallet refunds (emit event)
- Card refunds (gateway API call)
- PayPal, Stripe, SSLCommerz, etc.

**Returns**:

```typescript
{
  success: boolean,
  error?: string,
  gatewayResponse?: PaymentGatewayResponse
}
```

**Integration**: Placeholder for payment gateway integration

---

### 21. `updateOrderAfterRefund(refund, session)`

**Purpose**: Update order after successful refund

**Updates**:

- Increment `totalRefundedAmount`
- Change status to REFUNDED (if full refund)
- Update payment status

---

## Event Emissions

The service emits the following events:

| Event                   | Trigger            | Data                              |
| ----------------------- | ------------------ | --------------------------------- |
| `refund.requested`      | Refund created     | refundId, userId, orderId, amount |
| `refund.approved`       | Admin approves     | refundId, userId, amount          |
| `refund.rejected`       | Admin rejects      | refundId, userId, reason          |
| `refund.processing`     | Payment initiated  | refundId, userId, amount, method  |
| `refund.completed`      | Payment successful | refundId, userId, amount          |
| `refund.failed`         | Payment failed     | refundId, userId, error           |
| `refund.cancelled`      | User cancels       | refundId, userId                  |
| `refund.stock.restore`  | Stock restoration  | refundId, items, isSellable       |
| `refund.coupon.restore` | Coupon restoration | refundId, couponCode, userId      |
| `refund.wallet.credit`  | Wallet refund      | refundId, userId, amount          |

---

## Error Handling

All methods use appropriate HTTP exceptions:

- `NotFoundException` - Resource not found
- `BadRequestException` - Invalid request or business rule violation
- `UnauthorizedException` - Access denied
- `ConflictException` - Duplicate or conflicting state
- `InternalServerErrorException` - Unexpected errors

---

## Transaction Management

Methods using transactions:

- `createRefundRequest` - No (single operation)
- `adminRefundAction` - **Yes** (stock/coupon restoration)
- `processRefund` - **Yes** (payment + order update)

---

## Integration Points

### Required Services

1. **OrderService** - Order validation and updates
2. **InventoryService** - Stock restoration (event-driven)
3. **CouponService** - Coupon restoration (event-driven)
4. **PaymentService** - Payment gateway integration (to be implemented)
5. **WalletService** - Wallet credits (event-driven)
6. **NotificationService** - Email/SMS notifications (event-driven)

---

## Usage Examples

### Customer Creates Refund

```typescript
const refund = await refundService.createRefundRequest(userId, {
  orderId: '507f1f77bcf86cd799439011',
  refundType: RefundType.FULL,
  reason: RefundReason.DAMAGED_PRODUCT,
  reasonDetails: 'Product arrived damaged',
  evidence: {
    images: ['https://...'],
    description: 'Box was crushed',
  },
});
```

### Admin Approves Refund

```typescript
const refund = await refundService.adminRefundAction(refundId, adminId, {
  action: 'APPROVE',
  note: 'Valid claim, approved',
  restoreStock: true,
  restoreCoupon: false,
});
```

### Admin Processes Payment

```typescript
const refund = await refundService.processRefund(refundId, adminId, {
  processingFee: 0,
  restockingFee: 5.0,
  note: 'Processing refund',
});
```

---

## Next Steps

1. **Create RefundModule** - Wire up service with controllers
2. **Implement Controllers** - Customer and Admin endpoints
3. **Add Guards** - Authentication and authorization
4. **Integrate Services** - Connect with inventory, payment, wallet
5. **Add Tests** - Unit and integration tests
6. **API Documentation** - Swagger/OpenAPI specs

---

**Status**: ✅ Service Implementation Complete  
**File**: [`refund.service.ts`](file:///home/nahid-hossain/WebDev/Personal%20Projects/e-commerce/e-commerce-user-service/src/modules/order-service/refund/refund.service.ts)  
**Lines of Code**: ~800  
**Methods**: 21  
**Coverage**: Complete refund lifecycle
