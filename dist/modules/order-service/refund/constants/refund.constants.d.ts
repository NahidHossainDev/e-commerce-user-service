export declare const REFUND_ID_PREFIX = "REF";
export declare const REFUND_ID_LENGTH = 8;
export declare const generateRefundId: () => string;
export declare const REFUND_WINDOW_DAYS: {
    STANDARD: number;
    ELECTRONICS: number;
    PERISHABLE: number;
    CUSTOM: number;
    DIGITAL: number;
};
export declare const REFUNDABLE_ORDER_STATUSES: string[];
export declare const NON_REFUNDABLE_ORDER_STATUSES: string[];
export declare const RESTOCKING_FEE_PERCENTAGE: {
    CUSTOMER_CHANGED_MIND: number;
    SIZE_FIT_ISSUE: number;
    DEFAULT: number;
};
export declare const PROCESSING_FEE: {
    PERCENTAGE: number;
    MINIMUM: number;
    MAXIMUM: number;
};
export declare const calculateRestockingFee: (amount: number, reason: string) => number;
export declare const REFUND_AMOUNT_LIMITS: {
    MINIMUM: number;
    MAXIMUM: number;
    AUTO_APPROVE_THRESHOLD: number;
};
export declare const REFUND_PROCESSING_DAYS: {
    WALLET: number;
    ORIGINAL_PAYMENT_CARD: number;
    ORIGINAL_PAYMENT_PAYPAL: number;
    ORIGINAL_PAYMENT_BANK: number;
    BANK_TRANSFER: number;
    STORE_CREDIT: number;
};
export declare const ADMIN_REVIEW_SLA_HOURS = 24;
export declare const AUTO_ESCALATION_HOURS = 48;
export declare const EVIDENCE_FILE_SIZE_LIMITS: {
    IMAGE: number;
    VIDEO: number;
    DOCUMENT: number;
};
export declare const EVIDENCE_FILE_COUNT_LIMITS: {
    IMAGES: number;
    VIDEOS: number;
    DOCUMENTS: number;
};
export declare const ALLOWED_EVIDENCE_FILE_TYPES: {
    IMAGES: string[];
    VIDEOS: string[];
    DOCUMENTS: string[];
};
export declare const EVIDENCE_REQUIRED_REASONS: string[];
export declare const AUTO_APPROVE_REASONS: string[];
export declare const MANUAL_REVIEW_REQUIRED_REASONS: string[];
export declare const MAX_REFUNDS_PER_USER_PER_MONTH = 5;
export declare const MAX_REFUND_AMOUNT_PER_USER_PER_MONTH = 5000;
export declare const RESTORE_TO_SELLABLE_INVENTORY: string[];
export declare const RESTORE_TO_DAMAGED_INVENTORY: string[];
export declare const NO_STOCK_RESTORATION: string[];
export declare const COUPON_RESTORATION_RULES: {
    FULL_REFUND_ONLY: boolean;
    SINGLE_USE_ONLY: boolean;
    NOT_EXPIRED: boolean;
};
export declare const REFUND_NOTIFICATION_EVENTS: {
    REFUND_REQUESTED: string;
    REFUND_APPROVED: string;
    REFUND_REJECTED: string;
    REFUND_PROCESSING: string;
    REFUND_COMPLETED: string;
    REFUND_FAILED: string;
    REFUND_CANCELLED: string;
    ADMIN_REVIEW_REQUIRED: string;
    ADMIN_ESCALATION: string;
};
export declare const VALID_STATUS_TRANSITIONS: {
    REQUESTED: string[];
    PENDING_APPROVAL: string[];
    APPROVED: string[];
    PROCESSING: string[];
    REJECTED: never[];
    COMPLETED: never[];
    FAILED: string[];
    CANCELLED: never[];
};
export declare const isValidStatusTransition: (currentStatus: string, newStatus: string) => boolean;
export declare const REFUND_RATE_THRESHOLDS: {
    WARNING: number;
    CRITICAL: number;
};
export declare const PRODUCT_REFUND_RATE_THRESHOLD = 15;
export declare const REFUND_PAGINATION: {
    DEFAULT_PAGE: number;
    DEFAULT_LIMIT: number;
    MAX_LIMIT: number;
};
export declare const REFUND_SEARCHABLE_FIELDS: string[];
export declare const REFUND_SORTABLE_FIELDS: string[];
export declare const REFUND_DEFAULT_SORT: {
    FIELD: string;
    ORDER: string;
};
export declare const REFUND_REPORT_RANGES: {
    TODAY: number;
    LAST_7_DAYS: number;
    LAST_30_DAYS: number;
    LAST_90_DAYS: number;
    LAST_YEAR: number;
};
export declare const REFUND_EXPORT_FORMATS: string[];
export declare const REFUND_ERROR_MESSAGES: {
    ORDER_NOT_FOUND: string;
    ORDER_NOT_ELIGIBLE: string;
    REFUND_WINDOW_EXPIRED: string;
    REFUND_ALREADY_EXISTS: string;
    INVALID_REFUND_ITEMS: string;
    INVALID_STATUS_TRANSITION: string;
    INSUFFICIENT_EVIDENCE: string;
    AMOUNT_EXCEEDS_ORDER: string;
    PAYMENT_GATEWAY_ERROR: string;
    UNAUTHORIZED_ACCESS: string;
    REFUND_NOT_FOUND: string;
    INVALID_REFUND_METHOD: string;
    PROCESSING_FEE_INVALID: string;
};
export declare const REFUND_SUCCESS_MESSAGES: {
    REFUND_REQUESTED: string;
    REFUND_APPROVED: string;
    REFUND_REJECTED: string;
    REFUND_COMPLETED: string;
    REFUND_CANCELLED: string;
    STATUS_UPDATED: string;
    NOTE_ADDED: string;
};
export declare const REFUND_PERMISSIONS: {
    VIEW_ALL_REFUNDS: string;
    APPROVE_REFUND: string;
    REJECT_REFUND: string;
    PROCESS_REFUND: string;
    UPDATE_STATUS: string;
    ADD_NOTE: string;
    VIEW_ANALYTICS: string;
    EXPORT_DATA: string;
    BULK_APPROVE: string;
};
export declare const REFUND_WEBHOOK_EVENTS: {
    REFUND_CREATED: string;
    REFUND_APPROVED: string;
    REFUND_REJECTED: string;
    REFUND_COMPLETED: string;
    REFUND_FAILED: string;
};
export declare const REFUND_CACHE_TTL: {
    REFUND_DETAILS: number;
    REFUND_LIST: number;
    REFUND_STATS: number;
};
export declare const REFUND_RATE_LIMITS: {
    CREATE_REFUND: {
        MAX_REQUESTS: number;
        WINDOW_MS: number;
    };
    CANCEL_REFUND: {
        MAX_REQUESTS: number;
        WINDOW_MS: number;
    };
};
export declare const REFUND_FEATURE_FLAGS: {
    AUTO_APPROVAL_ENABLED: boolean;
    BULK_REFUND_ENABLED: boolean;
    PARTIAL_REFUND_ENABLED: boolean;
    SHIPPING_REFUND_ENABLED: boolean;
    WALLET_REFUND_ENABLED: boolean;
    STORE_CREDIT_ENABLED: boolean;
    EVIDENCE_REQUIRED: boolean;
    STOCK_RESTORATION_ENABLED: boolean;
    COUPON_RESTORATION_ENABLED: boolean;
};
export declare const PAYMENT_GATEWAY_CONFIG: {
    RETRY_ATTEMPTS: number;
    RETRY_DELAY_MS: number;
    TIMEOUT_MS: number;
};
export declare const INVENTORY_SYNC_CONFIG: {
    BATCH_SIZE: number;
    RETRY_ATTEMPTS: number;
};
export declare const REFUND_VALIDATION_RULES: {
    REASON_DETAILS_MAX_LENGTH: number;
    REJECTION_REASON_MAX_LENGTH: number;
    ADMIN_NOTE_MAX_LENGTH: number;
    INTERNAL_NOTE_MAX_LENGTH: number;
    CANCELLATION_REASON_MAX_LENGTH: number;
};
