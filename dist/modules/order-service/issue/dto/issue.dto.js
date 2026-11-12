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
exports.PaginatedIssueResponseDto = exports.IssueQueryOptionsDto = exports.AddIssueNoteDto = exports.ResolveIssueDto = exports.UpdateIssueStatusDto = exports.CreateIssueDto = exports.IssueItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const issue_schema_1 = require("../schemas/issue.schema");
class IssueItemDto {
    productId;
    name;
    variantSku;
    quantity;
    notes;
}
exports.IssueItemDto = IssueItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64b1f2c3d4e5f6a7b8c9d0e1' }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IssueItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Wireless Headphones' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IssueItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'SKU-123-WH' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IssueItemDto.prototype, "variantSku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], IssueItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Broken seal on box' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], IssueItemDto.prototype, "notes", void 0);
class CreateIssueDto {
    orderId;
    type;
    subject;
    description;
    priority;
    items;
    attachments;
}
exports.CreateIssueDto = CreateIssueDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '64b1f2c3d4e5f6a7b8c9d0e1',
        description: 'The order ID the issue relates to',
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: issue_schema_1.IssueType,
        example: issue_schema_1.IssueType.DAMAGED_PACKAGE,
        description: 'Type / category of the issue',
    }),
    (0, class_validator_1.IsEnum)(issue_schema_1.IssueType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Package arrived torn open',
        description: 'Brief headline of the issue',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Courier delivered parcel with ripped seal and 1 item missing.',
        description: 'Detailed description of the issue',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(3000),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: issue_schema_1.IssuePriority,
        example: issue_schema_1.IssuePriority.MEDIUM,
    }),
    (0, class_validator_1.IsEnum)(issue_schema_1.IssuePriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [IssueItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => IssueItemDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateIssueDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        example: ['https://example.com/box1.jpg'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateIssueDto.prototype, "attachments", void 0);
class UpdateIssueStatusDto {
    status;
    notes;
}
exports.UpdateIssueStatusDto = UpdateIssueStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: issue_schema_1.IssueStatus, example: issue_schema_1.IssueStatus.IN_PROGRESS }),
    (0, class_validator_1.IsEnum)(issue_schema_1.IssueStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateIssueStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Assigned to logistics team for courier review',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateIssueStatusDto.prototype, "notes", void 0);
class ResolveIssueDto {
    resolutionNotes;
    resolutionAction;
    internalNotes;
}
exports.ResolveIssueDto = ResolveIssueDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Customer was refunded for damaged item and replacement coupon sent',
        description: 'Detailed description of how the issue was resolved',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResolveIssueDto.prototype, "resolutionNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: issue_schema_1.ResolutionAction,
        example: issue_schema_1.ResolutionAction.REPLACEMENT_SENT,
    }),
    (0, class_validator_1.IsEnum)(issue_schema_1.ResolutionAction),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ResolveIssueDto.prototype, "resolutionAction", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Customer acknowledged and agreed via phone',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ResolveIssueDto.prototype, "internalNotes", void 0);
class AddIssueNoteDto {
    notes;
}
exports.AddIssueNoteDto = AddIssueNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Spoke with delivery agent, confirmed accident during transport',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddIssueNoteDto.prototype, "notes", void 0);
class IssueQueryOptionsDto {
    page = 1;
    limit = 10;
    search;
    status;
    type;
    priority;
    orderId;
    sortBy = 'createdAt';
    sortOrder = 'desc';
}
exports.IssueQueryOptionsDto = IssueQueryOptionsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], IssueQueryOptionsDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], IssueQueryOptionsDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search by issue number, subject, or orderId',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IssueQueryOptionsDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: issue_schema_1.IssueStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(issue_schema_1.IssueStatus),
    __metadata("design:type", String)
], IssueQueryOptionsDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: issue_schema_1.IssueType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(issue_schema_1.IssueType),
    __metadata("design:type", String)
], IssueQueryOptionsDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: issue_schema_1.IssuePriority }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(issue_schema_1.IssuePriority),
    __metadata("design:type", String)
], IssueQueryOptionsDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by specific order ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], IssueQueryOptionsDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 'createdAt' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IssueQueryOptionsDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['asc', 'desc'], default: 'desc' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IssueQueryOptionsDto.prototype, "sortOrder", void 0);
class PaginatedIssueResponseDto {
    data;
    page;
    limit;
    total;
    totalPages;
}
exports.PaginatedIssueResponseDto = PaginatedIssueResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [issue_schema_1.Issue] }),
    __metadata("design:type", Array)
], PaginatedIssueResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], PaginatedIssueResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginatedIssueResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25 }),
    __metadata("design:type", Number)
], PaginatedIssueResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], PaginatedIssueResponseDto.prototype, "totalPages", void 0);
//# sourceMappingURL=issue.dto.js.map