# Refund Workflow Diagrams

## Refund Status Flow

```mermaid
stateDiagram-v2
    [*] --> REQUESTED: Customer submits refund
    REQUESTED --> PENDING_APPROVAL: Auto-transition
    PENDING_APPROVAL --> APPROVED: Admin approves
    PENDING_APPROVAL --> REJECTED: Admin rejects
    APPROVED --> PROCESSING: Initiate payment
    PROCESSING --> COMPLETED: Gateway success
    PROCESSING --> FAILED: Gateway failure

    REQUESTED --> CANCELLED: Customer cancels
    PENDING_APPROVAL --> CANCELLED: Customer cancels
    APPROVED --> CANCELLED: Customer cancels

    REJECTED --> [*]
    COMPLETED --> [*]
    FAILED --> [*]
    CANCELLED --> [*]
```

## Complete Refund Process Flow

```mermaid
flowchart TD
    Start([Customer Initiates Refund]) --> ValidateOrder{Order Valid?}
    ValidateOrder -->|No| Error1[Return Error]
    ValidateOrder -->|Yes| CheckEligibility{Eligible for Refund?}

    CheckEligibility -->|No| Error2[Return Error: Not Eligible]
    CheckEligibility -->|Yes| CheckType{Refund Type?}

    CheckType -->|FULL| CalcFull[Calculate Full Refund Amount]
    CheckType -->|PARTIAL| ValidateItems{Items Valid?}
    CheckType -->|SHIPPING| CalcShipping[Calculate Shipping Refund]

    ValidateItems -->|No| Error3[Return Error: Invalid Items]
    ValidateItems -->|Yes| CalcPartial[Calculate Partial Refund Amount]

    CalcFull --> CreateRefund[Create Refund Record<br/>Status: REQUESTED]
    CalcPartial --> CreateRefund
    CalcShipping --> CreateRefund

    CreateRefund --> UpdateOrder[Update Order hasRefund Flag]
    UpdateOrder --> NotifyCustomer1[Notify Customer: Request Received]
    NotifyCustomer1 --> PendingApproval[Status: PENDING_APPROVAL]

    PendingApproval --> AdminReview{Admin Review}

    AdminReview -->|Approve| RecordApproval[Record Admin Action<br/>Status: APPROVED]
    AdminReview -->|Reject| RecordRejection[Record Rejection Reason<br/>Status: REJECTED]

    RecordRejection --> NotifyRejected[Notify Customer: Rejected]
    NotifyRejected --> End1([End])

    RecordApproval --> RestoreStock{Restore Stock?}
    RestoreStock -->|Yes| UpdateInventory[Update Product Inventory]
    RestoreStock -->|No| RestoreCoupon{Restore Coupon?}
    UpdateInventory --> RestoreCoupon

    RestoreCoupon -->|Yes| UpdateCoupon[Mark Coupon Available]
    RestoreCoupon -->|No| NotifyApproved[Notify Customer: Approved]
    UpdateCoupon --> NotifyApproved

    NotifyApproved --> ApplyFees{Apply Fees?}
    ApplyFees -->|Yes| DeductFees[Deduct Processing/Restocking Fees]
    ApplyFees -->|No| InitiatePayment[Status: PROCESSING]
    DeductFees --> RecalcAmount[Recalculate Final Amount]
    RecalcAmount --> InitiatePayment

    InitiatePayment --> CallGateway[Call Payment Gateway API]
    CallGateway --> GatewayResponse{Gateway Response}

    GatewayResponse -->|Success| RecordSuccess[Store Gateway Response<br/>Status: COMPLETED]
    GatewayResponse -->|Failure| RecordFailure[Store Failure Reason<br/>Status: FAILED]

    RecordSuccess --> UpdateOrderRefund[Update Order:<br/>- Add to refundIds<br/>- Update totalRefundedAmount]
    UpdateOrderRefund --> UpdatePaymentStatus[Update Order Payment Status]
    UpdatePaymentStatus --> CreditWallet{Refund to Wallet?}

    CreditWallet -->|Yes| UpdateWallet[Credit User Wallet]
    CreditWallet -->|No| NotifyCompleted[Notify Customer: Completed]
    UpdateWallet --> NotifyCompleted
    NotifyCompleted --> End2([End: Success])

    RecordFailure --> NotifyFailed[Notify Admin: Manual Intervention]
    NotifyFailed --> End3([End: Failed])
```

## Refund Amount Calculation Flow

```mermaid
flowchart TD
    Start([Calculate Refund Amount]) --> CheckType{Refund Type}

    CheckType -->|FULL| GetOrderTotal[Get Order Payable Amount]
    CheckType -->|PARTIAL| GetItems[Get Refund Items]
    CheckType -->|SHIPPING| GetShipping[Get Shipping Charge]

    GetOrderTotal --> FullCalc[itemsTotal = payableAmount<br/>- deliveryCharge]
    GetItems --> SumItems[itemsTotal = Σ item.quantity × item.price]
    GetShipping --> ShippingCalc[shippingRefund = deliveryCharge]

    FullCalc --> FullShipping[shippingRefund = deliveryCharge]
    SumItems --> CalcProportional[Calculate Proportional Shipping:<br/>shippingRefund = itemsTotal / orderTotal × deliveryCharge]

    FullShipping --> FullTax[taxRefund = original tax]
    CalcProportional --> PartialTax[Calculate Proportional Tax:<br/>taxRefund = itemsTotal / orderTotal × tax]
    ShippingCalc --> NoItems[itemsTotal = 0<br/>taxRefund = 0]

    FullTax --> CheckCoupon{Coupon Used?}
    PartialTax --> CheckCoupon
    NoItems --> CheckCoupon

    CheckCoupon -->|Yes| CouponCalc[couponRefund = coupon discount]
    CheckCoupon -->|No| CheckWallet{Wallet Used?}
    CouponCalc --> CheckWallet

    CheckWallet -->|Yes| WalletCalc[walletRefund = wallet amount used]
    CheckWallet -->|No| CheckFees{Apply Fees?}
    WalletCalc --> CheckFees

    CheckFees -->|Yes| ApplyFees[processingFee = X<br/>restockingFee = Y]
    CheckFees -->|No| NoFees[processingFee = 0<br/>restockingFee = 0]

    ApplyFees --> FinalCalc[totalRefundAmount =<br/>itemsTotal + shippingRefund + taxRefund<br/>+ couponRefund + walletRefund<br/>- processingFee - restockingFee]
    NoFees --> FinalCalc

    FinalCalc --> Validate{Amount > 0?}
    Validate -->|Yes| CreateAmount[Create RefundAmount Object]
    Validate -->|No| Error[Error: Invalid Amount]

    CreateAmount --> End([Return RefundAmount])
```

## Database Schema Relationships

```mermaid
erDiagram
    Order ||--o{ Refund : "has many"
    User ||--o{ Refund : "requests"
    Refund ||--o{ RefundItem : "contains"
    Refund ||--|| RefundAmount : "has"
    Refund ||--o| RefundEvidence : "has"
    Refund ||--|| RefundTimeline : "tracks"
    Refund ||--o{ AdminAction : "has many"
    Refund ||--o| PaymentGatewayResponse : "has"

    Order {
        ObjectId _id
        string orderId
        ObjectId userId
        string status
        boolean hasRefund
        ObjectId[] refundIds
        number totalRefundedAmount
    }

    Refund {
        ObjectId _id
        string refundId
        ObjectId orderId
        string orderNumber
        ObjectId userId
        string refundType
        string status
        string reason
        string refundMethod
    }

    RefundItem {
        ObjectId productId
        string name
        string variantSku
        number quantity
        number unitPrice
        number totalAmount
    }

    RefundAmount {
        number itemsTotal
        number shippingRefund
        number taxRefund
        number couponRefund
        number walletRefund
        number processingFee
        number restockingFee
        number totalRefundAmount
    }

    RefundEvidence {
        string[] images
        string[] videos
        string description
        string[] documents
    }

    RefundTimeline {
        Date requestedAt
        Date approvedAt
        Date rejectedAt
        Date processingStartedAt
        Date completedAt
    }

    AdminAction {
        ObjectId adminId
        string action
        string note
        Date timestamp
    }

    PaymentGatewayResponse {
        string gateway
        string transactionId
        string refundId
        string status
        object rawResponse
    }
```

## Admin Dashboard Flow

```mermaid
flowchart TD
    Start([Admin Opens Refund Dashboard]) --> LoadRefunds[Load Refunds List<br/>Filter: PENDING_APPROVAL]
    LoadRefunds --> DisplayList[Display Refund Requests]

    DisplayList --> SelectRefund{Admin Action}

    SelectRefund -->|View Details| ShowDetails[Show Full Refund Details:<br/>- Order info<br/>- Customer info<br/>- Evidence<br/>- Amounts]
    SelectRefund -->|Filter/Search| ApplyFilters[Apply Filters:<br/>- Status<br/>- Date range<br/>- Amount range<br/>- Reason]
    SelectRefund -->|Bulk Action| SelectMultiple[Select Multiple Refunds]

    ShowDetails --> ReviewEvidence[Review Evidence:<br/>- Images<br/>- Videos<br/>- Description]
    ReviewEvidence --> CheckPolicy{Meets Policy?}

    CheckPolicy -->|Yes| ApproveAction[Click Approve Button]
    CheckPolicy -->|No| RejectAction[Click Reject Button]

    ApproveAction --> ApproveForm[Fill Approval Form:<br/>- Restore stock?<br/>- Restore coupon?<br/>- Admin note]
    RejectAction --> RejectForm[Fill Rejection Form:<br/>- Rejection reason<br/>- Admin note]

    ApproveForm --> SubmitApprove[Submit Approval]
    RejectForm --> SubmitReject[Submit Rejection]

    SubmitApprove --> ProcessApproval[Backend: Update Status to APPROVED<br/>Record Admin Action]
    SubmitReject --> ProcessRejection[Backend: Update Status to REJECTED<br/>Record Admin Action]

    ProcessApproval --> ShowApproved[Show Success Message<br/>Move to Approved List]
    ProcessRejection --> ShowRejected[Show Success Message<br/>Move to Rejected List]

    ShowApproved --> ProcessPayment{Process Payment Now?}
    ProcessPayment -->|Yes| InitiatePayment[Initiate Payment Gateway Refund]
    ProcessPayment -->|No| BackToDashboard[Back to Dashboard]

    InitiatePayment --> PaymentResult{Payment Result}
    PaymentResult -->|Success| ShowSuccess[Show Success<br/>Status: COMPLETED]
    PaymentResult -->|Failed| ShowFailure[Show Failure<br/>Status: FAILED<br/>Flag for Manual Review]

    ShowRejected --> BackToDashboard
    ShowSuccess --> BackToDashboard
    ShowFailure --> BackToDashboard

    ApplyFilters --> LoadRefunds
    SelectMultiple --> BulkApprove{Bulk Action Type}
    BulkApprove -->|Approve All| BulkApproveProcess[Approve Selected Refunds]
    BulkApprove -->|Export| ExportData[Export to CSV/Excel]

    BulkApproveProcess --> BackToDashboard
    ExportData --> BackToDashboard
    BackToDashboard --> End([End])
```

## Customer Refund Request Flow

```mermaid
flowchart TD
    Start([Customer Views Order]) --> CheckStatus{Order Status}
    CheckStatus -->|DELIVERED| ShowRefundButton[Show "Request Refund" Button]
    CheckStatus -->|Other| HideButton[Hide Refund Option]

    ShowRefundButton --> ClickRefund[Click Request Refund]
    ClickRefund --> SelectType{Select Refund Type}

    SelectType -->|Full Refund| FullForm[Show Full Refund Form]
    SelectType -->|Partial Refund| PartialForm[Show Item Selection]

    FullForm --> SelectReason[Select Refund Reason]
    PartialForm --> SelectItems[Select Items to Refund:<br/>- Choose products<br/>- Set quantities]

    SelectItems --> SelectReason
    SelectReason --> EnterDetails[Enter Reason Details<br/>Max 1000 characters]

    EnterDetails --> UploadEvidence{Upload Evidence?}
    UploadEvidence -->|Yes| UploadFiles[Upload:<br/>- Images<br/>- Videos<br/>- Documents]
    UploadEvidence -->|No| SelectMethod[Select Refund Method:<br/>- Original Payment<br/>- Wallet<br/>- Bank Transfer]

    UploadFiles --> SelectMethod
    SelectMethod --> ReviewSummary[Review Refund Summary:<br/>- Items<br/>- Amounts<br/>- Method]

    ReviewSummary --> ConfirmSubmit{Confirm?}
    ConfirmSubmit -->|No| EditForm[Edit Form]
    ConfirmSubmit -->|Yes| SubmitRequest[Submit Refund Request]

    EditForm --> SelectType
    SubmitRequest --> Validate{Validation}

    Validate -->|Failed| ShowErrors[Show Validation Errors]
    Validate -->|Success| CreateRecord[Create Refund Record<br/>Status: REQUESTED]

    ShowErrors --> EditForm
    CreateRecord --> SendNotification[Send Email/SMS Confirmation]
    SendNotification --> ShowSuccess[Show Success Message:<br/>"Refund request submitted<br/>Refund ID: #REF-12345"]

    ShowSuccess --> TrackRefund[Redirect to Track Refund Page]
    TrackRefund --> End([End])
```

## Integration Architecture

```mermaid
flowchart LR
    subgraph "Frontend"
        CustomerUI[Customer Portal]
        AdminUI[Admin Dashboard]
    end

    subgraph "API Layer"
        RefundController[Refund Controller]
        AuthGuard[Auth Guard]
        RoleGuard[Role Guard]
    end

    subgraph "Service Layer"
        RefundService[Refund Service]
        OrderService[Order Service]
        InventoryService[Inventory Service]
        PaymentService[Payment Service]
        CouponService[Coupon Service]
        WalletService[Wallet Service]
        NotificationService[Notification Service]
    end

    subgraph "Database"
        RefundDB[(Refund Collection)]
        OrderDB[(Order Collection)]
        ProductDB[(Product Collection)]
    end

    subgraph "External Services"
        PaymentGateway[Payment Gateway<br/>Stripe/PayPal/SSLCommerz]
        EmailService[Email Service]
        SMSService[SMS Service]
        FileStorage[Cloud Storage<br/>S3/Cloudinary]
    end

    CustomerUI --> RefundController
    AdminUI --> RefundController
    RefundController --> AuthGuard
    AuthGuard --> RoleGuard
    RoleGuard --> RefundService

    RefundService --> RefundDB
    RefundService --> OrderService
    RefundService --> InventoryService
    RefundService --> PaymentService
    RefundService --> CouponService
    RefundService --> WalletService
    RefundService --> NotificationService

    OrderService --> OrderDB
    InventoryService --> ProductDB
    PaymentService --> PaymentGateway
    NotificationService --> EmailService
    NotificationService --> SMSService
    RefundService --> FileStorage
```
