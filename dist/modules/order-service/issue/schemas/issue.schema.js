"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueSchema = exports.Issue = exports.IssueTimeline = exports.IssueItem = exports.ResolutionAction = exports.IssuePriority = exports.IssueType = exports.IssueStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
var IssueStatus;
(function (IssueStatus) {
    IssueStatus["OPEN"] = "OPEN";
    IssueStatus["IN_PROGRESS"] = "IN_PROGRESS";
    IssueStatus["RESOLVED"] = "RESOLVED";
    IssueStatus["CLOSED"] = "CLOSED";
    IssueStatus["REJECTED"] = "REJECTED";
})(IssueStatus || (exports.IssueStatus = IssueStatus = {}));
var IssueType;
(function (IssueType) {
    IssueType["DAMAGED_PACKAGE"] = "DAMAGED_PACKAGE";
    IssueType["MISSING_ITEMS"] = "MISSING_ITEMS";
    IssueType["WRONG_ITEM_DELIVERED"] = "WRONG_ITEM_DELIVERED";
    IssueType["DELIVERY_DELAY"] = "DELIVERY_DELAY";
    IssueType["BILLING_ISSUE"] = "BILLING_ISSUE";
    IssueType["PRODUCT_QUALITY"] = "PRODUCT_QUALITY";
    IssueType["CUSTOMER_SERVICE"] = "CUSTOMER_SERVICE";
    IssueType["OTHER"] = "OTHER";
})(IssueType || (exports.IssueType = IssueType = {}));
var IssuePriority;
(function (IssuePriority) {
    IssuePriority["LOW"] = "LOW";
    IssuePriority["MEDIUM"] = "MEDIUM";
    IssuePriority["HIGH"] = "HIGH";
    IssuePriority["URGENT"] = "URGENT";
})(IssuePriority || (exports.IssuePriority = IssuePriority = {}));
var ResolutionAction;
(function (ResolutionAction) {
    ResolutionAction["REFUND_OFFERED"] = "REFUND_OFFERED";
    ResolutionAction["REPLACEMENT_SENT"] = "REPLACEMENT_SENT";
    ResolutionAction["COUPON_ISSUED"] = "COUPON_ISSUED";
    ResolutionAction["EXPLAINED_TO_CUSTOMER"] = "EXPLAINED_TO_CUSTOMER";
    ResolutionAction["NO_ACTION_REQUIRED"] = "NO_ACTION_REQUIRED";
    ResolutionAction["OTHER"] = "OTHER";
})(ResolutionAction || (exports.ResolutionAction = ResolutionAction = {}));
let IssueItem = class IssueItem {
    productId;
    name;
    variantSku;
    quantity;
    notes;
};
exports.IssueItem = IssueItem;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e1' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Product' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], IssueItem.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Wireless Headphones' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], IssueItem.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SKU-123-WH' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], IssueItem.prototype, "variantSku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], IssueItem.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Broken seal on box' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], IssueItem.prototype, "notes", void 0);
exports.IssueItem = IssueItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], IssueItem);
let IssueTimeline = class IssueTimeline {
    action;
    actorType;
    actorId;
    notes;
    createdAt;
};
exports.IssueTimeline = IssueTimeline;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'STATUS_CHANGED' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], IssueTimeline.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['CUSTOMER', 'ADMIN', 'SYSTEM'], example: 'ADMIN' }),
    (0, mongoose_1.Prop)({ required: true, enum: ['CUSTOMER', 'ADMIN', 'SYSTEM'] }),
    __metadata("design:type", String)
], IssueTimeline.prototype, "actorType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e1' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], IssueTimeline.prototype, "actorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Investigating delivery logs with courier' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], IssueTimeline.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-10-22T10:00:00.000Z' }),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], IssueTimeline.prototype, "createdAt", void 0);
exports.IssueTimeline = IssueTimeline = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], IssueTimeline);
let Issue = class Issue {
    issueNumber;
    orderId;
    userId;
    type;
    subject;
    description;
    priority;
    status;
    items;
    attachments;
    adminNotes;
    resolutionNotes;
    resolutionAction;
    resolvedBy;
    resolvedAt;
    timeline;
};
exports.Issue = Issue;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ISS-20261022-1001' }),
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Issue.prototype, "issueNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e1' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Order', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Issue.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e2' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Issue.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: IssueType, example: IssueType.DAMAGED_PACKAGE }),
    (0, mongoose_1.Prop)({ type: String, enum: IssueType, required: true, index: true }),
    __metadata("design:type", String)
], Issue.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Parcel was arrived crushed with broken seal' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Issue.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'The delivery box was torn open and 1 item is missing' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Issue.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: IssuePriority, example: IssuePriority.MEDIUM }),
    (0, mongoose_1.Prop)({
        type: String,
        enum: IssuePriority,
        default: IssuePriority.MEDIUM,
        index: true,
    }),
    __metadata("design:type", String)
], Issue.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: IssueStatus, example: IssueStatus.OPEN }),
    (0, mongoose_1.Prop)({
        type: String,
        enum: IssueStatus,
        default: IssueStatus.OPEN,
        index: true,
    }),
    __metadata("design:type", String)
], Issue.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [IssueItem] }),
    (0, mongoose_1.Prop)({ type: [IssueItem], default: [] }),
    __metadata("design:type", Array)
], Issue.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['https://storage.example.com/box1.jpg'],
    }),
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Issue.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Customer called, verified courier damage receipt' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Issue.prototype, "adminNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Replacement sent via express delivery #TRK-992' }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Issue.prototype, "resolutionNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ResolutionAction }),
    (0, mongoose_1.Prop)({ type: String, enum: ResolutionAction }),
    __metadata("design:type", String)
], Issue.prototype, "resolutionAction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Issue.prototype, "resolvedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Issue.prototype, "resolvedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [IssueTimeline] }),
    (0, mongoose_1.Prop)({ type: [IssueTimeline], default: [] }),
    __metadata("design:type", Array)
], Issue.prototype, "timeline", void 0);
exports.Issue = Issue = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Issue);
exports.IssueSchema = mongoose_1.SchemaFactory.createForClass(Issue);
exports.IssueSchema.index({ createdAt: -1 });
exports.IssueSchema.index({ status: 1, priority: 1 });
//# sourceMappingURL=issue.schema.js.map