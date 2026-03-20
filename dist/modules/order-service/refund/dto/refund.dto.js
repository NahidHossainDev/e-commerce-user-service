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
exports.CancelRefundRequestDto = exports.AddRefundNoteDto = exports.UpdateRefundStatusDto = exports.ProcessRefundDto = exports.AdminRefundActionDto = exports.CreateRefundRequestDto = exports.RefundEvidenceDto = exports.RefundItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const refund_schema_1 = require("../schemas/refund.schema");
class RefundItemDto {
    productId;
    variantSku;
    quantity;
    reason;
}
exports.RefundItemDto = RefundItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product ID to refund' }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RefundItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Variant SKU if applicable' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RefundItemDto.prototype, "variantSku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity to refund', minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RefundItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Item-specific refund reason' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], RefundItemDto.prototype, "reason", void 0);
class RefundEvidenceDto {
    images;
    videos;
    description;
    documents;
}
exports.RefundEvidenceDto = RefundEvidenceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Image URLs as evidence',
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], RefundEvidenceDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Video URLs as evidence',
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], RefundEvidenceDto.prototype, "videos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Detailed description of the issue' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], RefundEvidenceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Supporting document URLs',
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUrl)({}, { each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], RefundEvidenceDto.prototype, "documents", void 0);
class CreateRefundRequestDto {
    orderId;
    refundType;
    reason;
    reasonDetails;
    items;
    refundMethod;
    evidence;
}
exports.CreateRefundRequestDto = CreateRefundRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Order ID to refund' }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRefundRequestDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of refund',
        enum: refund_schema_1.RefundType,
        example: refund_schema_1.RefundType.FULL,
    }),
    (0, class_validator_1.IsEnum)(refund_schema_1.RefundType),
    __metadata("design:type", String)
], CreateRefundRequestDto.prototype, "refundType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for refund',
        enum: refund_schema_1.RefundReason,
        example: refund_schema_1.RefundReason.DAMAGED_PRODUCT,
    }),
    (0, class_validator_1.IsEnum)(refund_schema_1.RefundReason),
    __metadata("design:type", String)
], CreateRefundRequestDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional details about the reason' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateRefundRequestDto.prototype, "reasonDetails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Items to refund (required for PARTIAL refunds)',
        type: [RefundItemDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RefundItemDto),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateRefundRequestDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Preferred refund method',
        enum: refund_schema_1.RefundMethod,
        example: refund_schema_1.RefundMethod.ORIGINAL_PAYMENT,
    }),
    (0, class_validator_1.IsEnum)(refund_schema_1.RefundMethod),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRefundRequestDto.prototype, "refundMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Evidence supporting the refund request',
        type: RefundEvidenceDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RefundEvidenceDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", RefundEvidenceDto)
], CreateRefundRequestDto.prototype, "evidence", void 0);
class AdminRefundActionDto {
    action;
    note;
    rejectionReason;
    restoreStock;
    restoreCoupon;
}
exports.AdminRefundActionDto = AdminRefundActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Action to take',
        enum: ['APPROVE', 'REJECT'],
        example: 'APPROVE',
    }),
    (0, class_validator_1.IsEnum)(['APPROVE', 'REJECT']),
    __metadata("design:type", String)
], AdminRefundActionDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Admin note/comment' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], AdminRefundActionDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Rejection reason (required if action is REJECT)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], AdminRefundActionDto.prototype, "rejectionReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to restore stock',
        default: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AdminRefundActionDto.prototype, "restoreStock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to restore coupon',
        default: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AdminRefundActionDto.prototype, "restoreCoupon", void 0);
class ProcessRefundDto {
    processingFee;
    restockingFee;
    note;
}
exports.ProcessRefundDto = ProcessRefundDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Processing fee to deduct' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ProcessRefundDto.prototype, "processingFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Restocking fee to deduct' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ProcessRefundDto.prototype, "restockingFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Admin note' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], ProcessRefundDto.prototype, "note", void 0);
class UpdateRefundStatusDto {
    status;
    note;
    failureReason;
}
exports.UpdateRefundStatusDto = UpdateRefundStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New refund status',
        enum: refund_schema_1.RefundStatus,
    }),
    (0, class_validator_1.IsEnum)(refund_schema_1.RefundStatus),
    __metadata("design:type", String)
], UpdateRefundStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Note about status change' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateRefundStatusDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Failure reason (if status is FAILED)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateRefundStatusDto.prototype, "failureReason", void 0);
class AddRefundNoteDto {
    note;
}
exports.AddRefundNoteDto = AddRefundNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Internal note to add' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], AddRefundNoteDto.prototype, "note", void 0);
class CancelRefundRequestDto {
    cancellationReason;
}
exports.CancelRefundRequestDto = CancelRefundRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for cancellation' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CancelRefundRequestDto.prototype, "cancellationReason", void 0);
//# sourceMappingURL=refund.dto.js.map