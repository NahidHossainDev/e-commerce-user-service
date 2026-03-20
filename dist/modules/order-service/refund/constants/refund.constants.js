"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFUND_VALIDATION_RULES = exports.INVENTORY_SYNC_CONFIG = exports.PAYMENT_GATEWAY_CONFIG = exports.REFUND_FEATURE_FLAGS = exports.REFUND_RATE_LIMITS = exports.REFUND_CACHE_TTL = exports.REFUND_WEBHOOK_EVENTS = exports.REFUND_PERMISSIONS = exports.REFUND_SUCCESS_MESSAGES = exports.REFUND_ERROR_MESSAGES = exports.REFUND_EXPORT_FORMATS = exports.REFUND_REPORT_RANGES = exports.REFUND_DEFAULT_SORT = exports.REFUND_SORTABLE_FIELDS = exports.REFUND_SEARCHABLE_FIELDS = exports.REFUND_PAGINATION = exports.PRODUCT_REFUND_RATE_THRESHOLD = exports.REFUND_RATE_THRESHOLDS = exports.isValidStatusTransition = exports.VALID_STATUS_TRANSITIONS = exports.REFUND_NOTIFICATION_EVENTS = exports.COUPON_RESTORATION_RULES = exports.NO_STOCK_RESTORATION = exports.RESTORE_TO_DAMAGED_INVENTORY = exports.RESTORE_TO_SELLABLE_INVENTORY = exports.MAX_REFUND_AMOUNT_PER_USER_PER_MONTH = exports.MAX_REFUNDS_PER_USER_PER_MONTH = exports.MANUAL_REVIEW_REQUIRED_REASONS = exports.AUTO_APPROVE_REASONS = exports.EVIDENCE_REQUIRED_REASONS = exports.ALLOWED_EVIDENCE_FILE_TYPES = exports.EVIDENCE_FILE_COUNT_LIMITS = exports.EVIDENCE_FILE_SIZE_LIMITS = exports.AUTO_ESCALATION_HOURS = exports.ADMIN_REVIEW_SLA_HOURS = exports.REFUND_PROCESSING_DAYS = exports.REFUND_AMOUNT_LIMITS = exports.calculateRestockingFee = exports.PROCESSING_FEE = exports.RESTOCKING_FEE_PERCENTAGE = exports.NON_REFUNDABLE_ORDER_STATUSES = exports.REFUNDABLE_ORDER_STATUSES = exports.REFUND_WINDOW_DAYS = exports.generateRefundId = exports.REFUND_ID_LENGTH = exports.REFUND_ID_PREFIX = void 0;
exports.REFUND_ID_PREFIX = 'REF';
exports.REFUND_ID_LENGTH = 8;
const generateRefundId = () => {
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    return `${exports.REFUND_ID_PREFIX}-${randomDigits}`;
};
exports.generateRefundId = generateRefundId;
exports.REFUND_WINDOW_DAYS = {
    STANDARD: 30,
    ELECTRONICS: 14,
    PERISHABLE: 7,
    CUSTOM: 0,
    DIGITAL: 0,
};
exports.REFUNDABLE_ORDER_STATUSES = [
    'DELIVERED',
    'SHIPPED',
];
exports.NON_REFUNDABLE_ORDER_STATUSES = [
    'PENDING',
    'CONFIRMED',
    'PACKED',
    'CANCELLED',
    'REFUNDED',
];
exports.RESTOCKING_FEE_PERCENTAGE = {
    CUSTOMER_CHANGED_MIND: 10,
    SIZE_FIT_ISSUE: 5,
    DEFAULT: 0,
};
exports.PROCESSING_FEE = {
    PERCENTAGE: 0,
    MINIMUM: 0,
    MAXIMUM: 0,
};
const calculateRestockingFee = (amount, reason) => {
    const percentage = exports.RESTOCKING_FEE_PERCENTAGE[reason] || exports.RESTOCKING_FEE_PERCENTAGE.DEFAULT;
    return (amount * percentage) / 100;
};
exports.calculateRestockingFee = calculateRestockingFee;
exports.REFUND_AMOUNT_LIMITS = {
    MINIMUM: 1,
    MAXIMUM: 1000000,
    AUTO_APPROVE_THRESHOLD: 50,
};
exports.REFUND_PROCESSING_DAYS = {
    WALLET: 2,
    ORIGINAL_PAYMENT_CARD: 5,
    ORIGINAL_PAYMENT_PAYPAL: 3,
    ORIGINAL_PAYMENT_BANK: 7,
    BANK_TRANSFER: 7,
    STORE_CREDIT: 0,
};
exports.ADMIN_REVIEW_SLA_HOURS = 24;
exports.AUTO_ESCALATION_HOURS = 48;
exports.EVIDENCE_FILE_SIZE_LIMITS = {
    IMAGE: 5,
    VIDEO: 50,
    DOCUMENT: 10,
};
exports.EVIDENCE_FILE_COUNT_LIMITS = {
    IMAGES: 10,
    VIDEOS: 3,
    DOCUMENTS: 5,
};
exports.ALLOWED_EVIDENCE_FILE_TYPES = {
    IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    VIDEOS: ['video/mp4', 'video/webm', 'video/quicktime'],
    DOCUMENTS: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
};
exports.EVIDENCE_REQUIRED_REASONS = [
    'DAMAGED_PRODUCT',
    'WRONG_ITEM',
    'DEFECTIVE_PRODUCT',
    'NOT_AS_DESCRIBED',
    'QUALITY_ISSUE',
];
exports.AUTO_APPROVE_REASONS = ['LATE_DELIVERY', 'DUPLICATE_ORDER'];
exports.MANUAL_REVIEW_REQUIRED_REASONS = ['FRAUDULENT_ORDER', 'OTHER'];
exports.MAX_REFUNDS_PER_USER_PER_MONTH = 5;
exports.MAX_REFUND_AMOUNT_PER_USER_PER_MONTH = 5000;
exports.RESTORE_TO_SELLABLE_INVENTORY = [
    'CUSTOMER_CHANGED_MIND',
    'SIZE_FIT_ISSUE',
    'DUPLICATE_ORDER',
];
exports.RESTORE_TO_DAMAGED_INVENTORY = [
    'DAMAGED_PRODUCT',
    'DEFECTIVE_PRODUCT',
    'QUALITY_ISSUE',
];
exports.NO_STOCK_RESTORATION = [
    'LATE_DELIVERY',
    'FRAUDULENT_ORDER',
];
exports.COUPON_RESTORATION_RULES = {
    FULL_REFUND_ONLY: true,
    SINGLE_USE_ONLY: true,
    NOT_EXPIRED: true,
};
exports.REFUND_NOTIFICATION_EVENTS = {
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
exports.VALID_STATUS_TRANSITIONS = {
    REQUESTED: ['PENDING_APPROVAL', 'CANCELLED'],
    PENDING_APPROVAL: ['APPROVED', 'REJECTED', 'CANCELLED'],
    APPROVED: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['COMPLETED', 'FAILED'],
    REJECTED: [],
    COMPLETED: [],
    FAILED: ['PROCESSING'],
    CANCELLED: [],
};
const isValidStatusTransition = (currentStatus, newStatus) => {
    const allowedTransitions = exports.VALID_STATUS_TRANSITIONS[currentStatus] || [];
    return allowedTransitions.includes(newStatus);
};
exports.isValidStatusTransition = isValidStatusTransition;
exports.REFUND_RATE_THRESHOLDS = {
    WARNING: 5,
    CRITICAL: 10,
};
exports.PRODUCT_REFUND_RATE_THRESHOLD = 15;
exports.REFUND_PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};
exports.REFUND_SEARCHABLE_FIELDS = [
    'refundId',
    'orderNumber',
    'reasonDetails',
    'rejectionReason',
];
exports.REFUND_SORTABLE_FIELDS = [
    'createdAt',
    'updatedAt',
    'refundAmount.totalRefundAmount',
    'timeline.requestedAt',
    'timeline.completedAt',
];
exports.REFUND_DEFAULT_SORT = {
    FIELD: 'createdAt',
    ORDER: 'desc',
};
exports.REFUND_REPORT_RANGES = {
    TODAY: 1,
    LAST_7_DAYS: 7,
    LAST_30_DAYS: 30,
    LAST_90_DAYS: 90,
    LAST_YEAR: 365,
};
exports.REFUND_EXPORT_FORMATS = ['CSV', 'EXCEL', 'PDF'];
exports.REFUND_ERROR_MESSAGES = {
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
exports.REFUND_SUCCESS_MESSAGES = {
    REFUND_REQUESTED: 'Refund request submitted successfully',
    REFUND_APPROVED: 'Refund has been approved',
    REFUND_REJECTED: 'Refund has been rejected',
    REFUND_COMPLETED: 'Refund has been completed successfully',
    REFUND_CANCELLED: 'Refund request has been cancelled',
    STATUS_UPDATED: 'Refund status updated successfully',
    NOTE_ADDED: 'Note added successfully',
};
exports.REFUND_PERMISSIONS = {
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
exports.REFUND_WEBHOOK_EVENTS = {
    REFUND_CREATED: 'refund.created',
    REFUND_APPROVED: 'refund.approved',
    REFUND_REJECTED: 'refund.rejected',
    REFUND_COMPLETED: 'refund.completed',
    REFUND_FAILED: 'refund.failed',
};
exports.REFUND_CACHE_TTL = {
    REFUND_DETAILS: 300,
    REFUND_LIST: 60,
    REFUND_STATS: 600,
};
exports.REFUND_RATE_LIMITS = {
    CREATE_REFUND: {
        MAX_REQUESTS: 5,
        WINDOW_MS: 3600000,
    },
    CANCEL_REFUND: {
        MAX_REQUESTS: 10,
        WINDOW_MS: 3600000,
    },
};
exports.REFUND_FEATURE_FLAGS = {
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
exports.PAYMENT_GATEWAY_CONFIG = {
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY_MS: 5000,
    TIMEOUT_MS: 30000,
};
exports.INVENTORY_SYNC_CONFIG = {
    BATCH_SIZE: 10,
    RETRY_ATTEMPTS: 2,
};
exports.REFUND_VALIDATION_RULES = {
    REASON_DETAILS_MAX_LENGTH: 1000,
    REJECTION_REASON_MAX_LENGTH: 500,
    ADMIN_NOTE_MAX_LENGTH: 2000,
    INTERNAL_NOTE_MAX_LENGTH: 5000,
    CANCELLATION_REASON_MAX_LENGTH: 500,
};
//# sourceMappingURL=refund.constants.js.map