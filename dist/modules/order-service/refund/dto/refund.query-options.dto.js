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
exports.RefundQueryOptions = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const refund_schema_1 = require("../schemas/refund.schema");
class RefundQueryOptions {
    searchTerm;
    userId;
    orderId;
    status;
    refundType;
    reason;
    page;
    limit;
    sortBy;
    sortOrder;
}
exports.RefundQueryOptions = RefundQueryOptions;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefundQueryOptions.prototype, "searchTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], RefundQueryOptions.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], RefundQueryOptions.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: refund_schema_1.RefundStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(refund_schema_1.RefundStatus),
    __metadata("design:type", String)
], RefundQueryOptions.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: refund_schema_1.RefundType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(refund_schema_1.RefundType),
    __metadata("design:type", String)
], RefundQueryOptions.prototype, "refundType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: refund_schema_1.RefundReason }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(refund_schema_1.RefundReason),
    __metadata("design:type", String)
], RefundQueryOptions.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], RefundQueryOptions.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], RefundQueryOptions.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefundQueryOptions.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['asc', 'desc'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['asc', 'desc']),
    __metadata("design:type", String)
], RefundQueryOptions.prototype, "sortOrder", void 0);
//# sourceMappingURL=refund.query-options.dto.js.map