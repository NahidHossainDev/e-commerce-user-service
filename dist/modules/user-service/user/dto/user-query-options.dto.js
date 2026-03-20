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
exports.UserQueryOptions = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const queryOptions_dto_1 = require("../../../../common/dto/queryOptions.dto");
const user_schema_1 = require("../user.schema");
class UserQueryOptions extends queryOptions_dto_1.QueryOptions {
    searchTerm;
    gender;
    userRole;
}
exports.UserQueryOptions = UserQueryOptions;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by full name or email' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserQueryOptions.prototype, "searchTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: user_schema_1.Gender, description: 'Filter by gender' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_schema_1.Gender),
    __metadata("design:type", String)
], UserQueryOptions.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: user_schema_1.UserRole, description: 'Filter by user type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_schema_1.UserRole),
    __metadata("design:type", String)
], UserQueryOptions.prototype, "userRole", void 0);
//# sourceMappingURL=user-query-options.dto.js.map