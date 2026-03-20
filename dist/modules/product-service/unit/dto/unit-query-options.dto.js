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
exports.UnitQueryOptions = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const queryOptions_dto_1 = require("../../../../common/dto/queryOptions.dto");
const unit_schema_1 = require("../schemas/unit.schema");
class UnitQueryOptions extends queryOptions_dto_1.QueryOptions {
    searchTerm;
    category;
}
exports.UnitQueryOptions = UnitQueryOptions;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by unit name or symbol' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UnitQueryOptions.prototype, "searchTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: unit_schema_1.UnitCategory,
        description: 'Filter by category',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(unit_schema_1.UnitCategory),
    __metadata("design:type", String)
], UnitQueryOptions.prototype, "category", void 0);
//# sourceMappingURL=unit-query-options.dto.js.map