import { Document, Types } from 'mongoose';
export type IssueDocument = Issue & Document;
export declare enum IssueStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED",
    REJECTED = "REJECTED"
}
export declare enum IssueType {
    DAMAGED_PACKAGE = "DAMAGED_PACKAGE",
    MISSING_ITEMS = "MISSING_ITEMS",
    WRONG_ITEM_DELIVERED = "WRONG_ITEM_DELIVERED",
    DELIVERY_DELAY = "DELIVERY_DELAY",
    BILLING_ISSUE = "BILLING_ISSUE",
    PRODUCT_QUALITY = "PRODUCT_QUALITY",
    CUSTOMER_SERVICE = "CUSTOMER_SERVICE",
    OTHER = "OTHER"
}
export declare enum IssuePriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare enum ResolutionAction {
    REFUND_OFFERED = "REFUND_OFFERED",
    REPLACEMENT_SENT = "REPLACEMENT_SENT",
    COUPON_ISSUED = "COUPON_ISSUED",
    EXPLAINED_TO_CUSTOMER = "EXPLAINED_TO_CUSTOMER",
    NO_ACTION_REQUIRED = "NO_ACTION_REQUIRED",
    OTHER = "OTHER"
}
export declare class IssueItem {
    productId: Types.ObjectId;
    name: string;
    variantSku?: string;
    quantity: number;
    notes?: string;
}
export declare class IssueTimeline {
    action: string;
    actorType: string;
    actorId?: Types.ObjectId;
    notes?: string;
    createdAt: Date;
}
export declare class Issue {
    issueNumber: string;
    orderId: Types.ObjectId;
    userId: Types.ObjectId;
    type: IssueType;
    subject: string;
    description: string;
    priority: IssuePriority;
    status: IssueStatus;
    items: IssueItem[];
    attachments: string[];
    adminNotes?: string;
    resolutionNotes?: string;
    resolutionAction?: ResolutionAction;
    resolvedBy?: Types.ObjectId;
    resolvedAt?: Date;
    timeline: IssueTimeline[];
}
export declare const IssueSchema: import("mongoose").Schema<Issue, import("mongoose").Model<Issue, any, any, any, Document<unknown, any, Issue, any, {}> & Issue & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Issue, Document<unknown, {}, import("mongoose").FlatRecord<Issue>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Issue> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
