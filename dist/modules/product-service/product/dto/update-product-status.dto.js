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
exports.BulkUpdateStatusDto = exports.UpdateProductStatusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const product_schema_1 = require("../schemas/product.schema");
class UpdateProductStatusDto {
    status;
}
exports.UpdateProductStatusDto = UpdateProductStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New status for the product',
        enum: product_schema_1.ProductStatus,
    }),
    (0, class_validator_1.IsEnum)(product_schema_1.ProductStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateProductStatusDto.prototype, "status", void 0);
class BulkUpdateStatusDto extends UpdateProductStatusDto {
    ids;
}
exports.BulkUpdateStatusDto = BulkUpdateStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of product IDs to update' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], BulkUpdateStatusDto.prototype, "ids", void 0);
//# sourceMappingURL=update-product-status.dto.js.map