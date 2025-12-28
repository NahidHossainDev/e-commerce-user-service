/**
 * Refund Constants and Configuration
 *
 * This file contains all constants, configuration values, and business rules
 * related to the refund system.
 */

// ============================================================================
// Refund ID Generation
// ============================================================================

export const REFUND_ID_PREFIX = 'REF';
export const REFUND_ID_LENGTH = 8; // e.g., REF-12345678

/**
 * Generate a unique refund ID
 * Format: REF-XXXXXXXX (8 random digits)
 */
export const generateRefundId = (): string => {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `${REFUND_ID_PREFIX}-${randomDigits}`;
};

// ============================================================================
// Refund Eligibility Rules
// ============================================================================

/**
 * Number of days within which refund can be requested after delivery
 */
export const REFUND_WINDOW_DAYS = {
  STANDARD: 30, // Standard products
  ELECTRONICS: 14, // Electronics and gadgets
  PERISHABLE: 7, // Perishable items
  CUSTOM: 0, // Custom/personalized items (non-refundable)
  DIGITAL: 0, // Digital products (non-refundable after download)
};

/**
 * Order statuses that are eligible for refund
 */
export const REFUNDABLE_ORDER_STATUSES = [
  'DELIVERED',
  'SHIPPED', // Can request refund even before delivery
];

/**
 * Order statuses that are NOT eligible for refund
 */
export const NON_REFUNDABLE_ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PACKED',
  'CANCELLED',
  'REFUNDED',
];

// ============================================================================
// Refund Fees Configuration
// ============================================================================

/**
 * Restocking fee percentages based on refund reason
 */
export const RESTOCKING_FEE_PERCENTAGE = {
  CUSTOMER_CHANGED_MIND: 10, // 10% restocking fee
  SIZE_FIT_ISSUE: 5, // 5% restocking fee
  DEFAULT: 0, // No restocking fee for other reasons
};

/**
 * Processing fee configuration
 */
export const PROCESSING_FEE = {
  PERCENTAGE: 0, // No processing fee by default
  MINIMUM: 0,
  MAXIMUM: 0,
};

/**
 * Calculate restocking fee based on reason and amount
 */
export const calculateRestockingFee = (
  amount: number,
  reason: string,
): number => {
  const percentage =
    RESTOCKING_FEE_PERCENTAGE[reason] || RESTOCKING_FEE_PERCENTAGE.DEFAULT;
  return (amount * percentage) / 100;
};

// ============================================================================
// Refund Amount Limits
// ============================================================================

export const REFUND_AMOUNT_LIMITS = {
  MINIMUM: 1, // Minimum refund amount (in base currency)
  MAXIMUM: 1000000, // Maximum refund amount per transaction
  AUTO_APPROVE_THRESHOLD: 50, // Auto-approve refunds below this amount
};

// ============================================================================
// Refund Processing Timeframes
// ============================================================================

/**
 * Expected processing time in business days by refund method
 */
export const REFUND_PROCESSING_DAYS = {
  WALLET: 2, // 1-2 business days
  ORIGINAL_PAYMENT_CARD: 5, // 3-5 business days
  ORIGINAL_PAYMENT_PAYPAL: 3, // 2-3 business days
  ORIGINAL_PAYMENT_BANK: 7, // 5-7 business days
  BANK_TRANSFER: 7, // 5-7 business days
  STORE_CREDIT: 0, // Instant
};

/**
 * SLA for admin review (in hours)
 */
export const ADMIN_REVIEW_SLA_HOURS = 24; // Review within 24 hours

/**
 * Auto-escalation time (in hours)
 */
export const AUTO_ESCALATION_HOURS = 48; // Escalate if not reviewed in 48 hours

// ============================================================================
// Evidence Requirements
// ============================================================================

/**
 * Maximum file sizes for evidence uploads (in MB)
 */
export const EVIDENCE_FILE_SIZE_LIMITS = {
  IMAGE: 5, // 5 MB per image
  VIDEO: 50, // 50 MB per video
  DOCUMENT: 10, // 10 MB per document
};

/**
 * Maximum number of files per evidence type
 */
export const EVIDENCE_FILE_COUNT_LIMITS = {
  IMAGES: 10,
  VIDEOS: 3,
  DOCUMENTS: 5,
};

/**
 * Allowed file types for evidence
 */
export const ALLOWED_EVIDENCE_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  VIDEOS: ['video/mp4', 'video/webm', 'video/quicktime'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
};

/**
 * Reasons that require evidence
 */
export const EVIDENCE_REQUIRED_REASONS = [
  'DAMAGED_PRODUCT',
  'WRONG_ITEM',
  'DEFECTIVE_PRODUCT',
  'NOT_AS_DESCRIBED',
  'QUALITY_ISSUE',
];

// ============================================================================
// Refund Approval Rules
// ============================================================================

/**
 * Reasons that can be auto-approved (if within threshold)
 */
export const AUTO_APPROVE_REASONS = ['LATE_DELIVERY', 'DUPLICATE_ORDER'];

/**
 * Reasons that always require manual review
 */
export const MANUAL_REVIEW_REQUIRED_REASONS = ['FRAUDULENT_ORDER', 'OTHER'];

/**
 * Maximum number of refunds per user per month before flagging
 */
export const MAX_REFUNDS_PER_USER_PER_MONTH = 5;

/**
 * Maximum refund amount per user per month before flagging
 */
export const MAX_REFUND_AMOUNT_PER_USER_PER_MONTH = 5000;

// ============================================================================
// Stock Restoration Rules
// ============================================================================

/**
 * Reasons where stock should be restored to sellable inventory
 */
export const RESTORE_TO_SELLABLE_INVENTORY = [
  'CUSTOMER_CHANGED_MIND',
  'SIZE_FIT_ISSUE',
  'DUPLICATE_ORDER',
];

/**
 * Reasons where stock should be marked as damaged
 */
export const RESTORE_TO_DAMAGED_INVENTORY = [
  'DAMAGED_PRODUCT',
  'DEFECTIVE_PRODUCT',
  'QUALITY_ISSUE',
];

/**
 * Reasons where stock should not be restored (items not returned)
 */
export const NO_STOCK_RESTORATION = [
  'LATE_DELIVERY', // Customer keeps the item
  'FRAUDULENT_ORDER', // Order never shipped
];

// ============================================================================
// Coupon Restoration Rules
// ============================================================================

/**
 * Conditions for coupon restoration
 */
export const COUPON_RESTORATION_RULES = {
  FULL_REFUND_ONLY: true, // Only restore coupon for full refunds
  SINGLE_USE_ONLY: true, // Only restore single-use coupons
  NOT_EXPIRED: true, // Only restore if coupon hasn't expired
};

// ============================================================================
// Notification Templates
// ============================================================================

export const REFUND_NOTIFICATION_EVENTS = {
  REFUND_REQUESTED: 'refund.requested',
  REFUND_APPROVED: 'refund.approved',
  REFUND_REJECTED: 'refund.rejected',
  REFUND_PROCESSING: 'refund.processing',
  REFUND_COMPLETED: 'refund.completed',
  REFUND_FAILED: 'refund.failed',
  REFUND_CANCELLED: 'refund.cancelled',
  ADMIN_REVIEW_REQUIRED: 'refund.admin_review_required',
  ADMIN_ESCALATION: 'refund.admin_escalation',
};

// ============================================================================
// Refund Status Transitions
// ============================================================================

/**
 * Valid status transitions
 * Key: Current Status, Value: Array of allowed next statuses
 */
export const VALID_STATUS_TRANSITIONS = {
  REQUESTED: ['PENDING_APPROVAL', 'CANCELLED'],
  PENDING_APPROVAL: ['APPROVED', 'REJECTED', 'CANCELLED'],
  APPROVED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['COMPLETED', 'FAILED'],
  REJECTED: [], // Terminal state
  COMPLETED: [], // Terminal state
  FAILED: ['PROCESSING'], // Can retry
  CANCELLED: [], // Terminal state
};

/**
 * Check if status transition is valid
 */
export const isValidStatusTransition = (
  currentStatus: string,
  newStatus: string,
): boolean => {
  const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus] || [];
  return allowedTransitions.includes(newStatus);
};

// ============================================================================
// Refund Metrics and Analytics
// ============================================================================

/**
 * Refund rate thresholds for alerts
 */
export const REFUND_RATE_THRESHOLDS = {
  WARNING: 5, // 5% refund rate triggers warning
  CRITICAL: 10, // 10% refund rate triggers critical alert
};

/**
 * Product-specific refund rate threshold
 */
export const PRODUCT_REFUND_RATE_THRESHOLD = 15; // 15% for a specific product

// ============================================================================
// Pagination Defaults
// ============================================================================

export const REFUND_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// ============================================================================
// Search and Filter Constants
// ============================================================================

/**
 * Fields that can be searched
 */
export const REFUND_SEARCHABLE_FIELDS = [
  'refundId',
  'orderNumber',
  'reasonDetails',
  'rejectionReason',
];

/**
 * Fields that can be sorted
 */
export const REFUND_SORTABLE_FIELDS = [
  'createdAt',
  'updatedAt',
  'refundAmount.totalRefundAmount',
  'timeline.requestedAt',
  'timeline.completedAt',
];

/**
 * Default sort configuration
 */
export const REFUND_DEFAULT_SORT = {
  FIELD: 'createdAt',
  ORDER: 'desc',
};

// ============================================================================
// Refund Report Configuration
// ============================================================================

/**
 * Report date range presets (in days)
 */
export const REFUND_REPORT_RANGES = {
  TODAY: 1,
  LAST_7_DAYS: 7,
  LAST_30_DAYS: 30,
  LAST_90_DAYS: 90,
  LAST_YEAR: 365,
};

/**
 * Export formats
 */
export const REFUND_EXPORT_FORMATS = ['CSV', 'EXCEL', 'PDF'];

// ============================================================================
// Error Messages
// ============================================================================

export const REFUND_ERROR_MESSAGES = {
  ORDER_NOT_FOUND: 'Order not found',
  ORDER_NOT_ELIGIBLE: 'Order is not eligible for refund',
  REFUND_WINDOW_EXPIRED: 'Refund window has expired',
  REFUND_ALREADY_EXISTS: 'A refund request already exists for this order',
  INVALID_REFUND_ITEMS: 'Invalid items specified for refund',
  INVALID_STATUS_TRANSITION: 'Invalid status transition',
  INSUFFICIENT_EVIDENCE: 'Evidence is required for this refund reason',
  AMOUNT_EXCEEDS_ORDER: 'Refund amount exceeds order total',
  PAYMENT_GATEWAY_ERROR: 'Payment gateway error occurred',
  UNAUTHORIZED_ACCESS: 'You are not authorized to access this refund',
  REFUND_NOT_FOUND: 'Refund not found',
  INVALID_REFUND_METHOD: 'Invalid refund method',
  PROCESSING_FEE_INVALID: 'Processing fee cannot exceed refund amount',
};

// ============================================================================
// Success Messages
// ============================================================================

export const REFUND_SUCCESS_MESSAGES = {
  REFUND_REQUESTED: 'Refund request submitted successfully',
  REFUND_APPROVED: 'Refund has been approved',
  REFUND_REJECTED: 'Refund has been rejected',
  REFUND_COMPLETED: 'Refund has been completed successfully',
  REFUND_CANCELLED: 'Refund request has been cancelled',
  STATUS_UPDATED: 'Refund status updated successfully',
  NOTE_ADDED: 'Note added successfully',
};

// ============================================================================
// Admin Permissions
// ============================================================================

export const REFUND_PERMISSIONS = {
  VIEW_ALL_REFUNDS: 'refund.view_all',
  APPROVE_REFUND: 'refund.approve',
  REJECT_REFUND: 'refund.reject',
  PROCESS_REFUND: 'refund.process',
  UPDATE_STATUS: 'refund.update_status',
  ADD_NOTE: 'refund.add_note',
  VIEW_ANALYTICS: 'refund.view_analytics',
  EXPORT_DATA: 'refund.export_data',
  BULK_APPROVE: 'refund.bulk_approve',
};

// ============================================================================
// Webhook Events
// ============================================================================

export const REFUND_WEBHOOK_EVENTS = {
  REFUND_CREATED: 'refund.created',
  REFUND_APPROVED: 'refund.approved',
  REFUND_REJECTED: 'refund.rejected',
  REFUND_COMPLETED: 'refund.completed',
  REFUND_FAILED: 'refund.failed',
};

// ============================================================================
// Cache Configuration
// ============================================================================

export const REFUND_CACHE_TTL = {
  REFUND_DETAILS: 300, // 5 minutes
  REFUND_LIST: 60, // 1 minute
  REFUND_STATS: 600, // 10 minutes
};

// ============================================================================
// Rate Limiting
// ============================================================================

export const REFUND_RATE_LIMITS = {
  CREATE_REFUND: {
    MAX_REQUESTS: 5,
    WINDOW_MS: 3600000, // 1 hour
  },
  CANCEL_REFUND: {
    MAX_REQUESTS: 10,
    WINDOW_MS: 3600000, // 1 hour
  },
};

// ============================================================================
// Feature Flags
// ============================================================================

export const REFUND_FEATURE_FLAGS = {
  AUTO_APPROVAL_ENABLED: true,
  BULK_REFUND_ENABLED: true,
  PARTIAL_REFUND_ENABLED: true,
  SHIPPING_REFUND_ENABLED: true,
  WALLET_REFUND_ENABLED: true,
  STORE_CREDIT_ENABLED: true,
  EVIDENCE_REQUIRED: true,
  STOCK_RESTORATION_ENABLED: true,
  COUPON_RESTORATION_ENABLED: true,
};

// ============================================================================
// Integration Configuration
// ============================================================================

export const PAYMENT_GATEWAY_CONFIG = {
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 5000, // 5 seconds
  TIMEOUT_MS: 30000, // 30 seconds
};

export const INVENTORY_SYNC_CONFIG = {
  BATCH_SIZE: 10,
  RETRY_ATTEMPTS: 2,
};

// ============================================================================
// Validation Rules
// ============================================================================

export const REFUND_VALIDATION_RULES = {
  REASON_DETAILS_MAX_LENGTH: 1000,
  REJECTION_REASON_MAX_LENGTH: 500,
  ADMIN_NOTE_MAX_LENGTH: 2000,
  INTERNAL_NOTE_MAX_LENGTH: 5000,
  CANCELLATION_REASON_MAX_LENGTH: 500,
};
