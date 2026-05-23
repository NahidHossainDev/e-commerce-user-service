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
exports.QueryCmsPageDto = exports.UpdateCmsPageDto = exports.CreateCmsPageDto = exports.CmsPageSeoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const queryOptions_dto_1 = require("../../../../common/dto/queryOptions.dto");
const page_enum_1 = require("../enums/page.enum");
class CmsPageSeoDto {
    title;
    description;
    keywords;
}
exports.CmsPageSeoDto = CmsPageSeoDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'HTML head meta title override' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CmsPageSeoDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'HTML head description content' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CmsPageSeoDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Keywords for search engine tags' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CmsPageSeoDto.prototype, "keywords", void 0);
class CreateCmsPageDto {
    title;
    slug;
    type = page_enum_1.CmsPageType.CUSTOM;
    status = page_enum_1.CmsPageStatus.DRAFT;
    isHomePage = false;
    seo;
}
exports.CreateCmsPageDto = CreateCmsPageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visual title of the page' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCmsPageDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unique url pathname slug. If empty, is automatically generated from title.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCmsPageDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: page_enum_1.CmsPageType, description: 'Page lock status type', default: page_enum_1.CmsPageType.CUSTOM }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(page_enum_1.CmsPageType),
    __metadata("design:type", String)
], CreateCmsPageDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: page_enum_1.CmsPageStatus, description: 'Page publishing status', default: page_enum_1.CmsPageStatus.DRAFT }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(page_enum_1.CmsPageStatus),
    __metadata("design:type", String)
], CreateCmsPageDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Set as the main home landing page', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCmsPageDto.prototype, "isHomePage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: CmsPageSeoDto, description: 'SEO properties mapping' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CmsPageSeoDto),
    __metadata("design:type", CmsPageSeoDto)
], CreateCmsPageDto.prototype, "seo", void 0);
class UpdateCmsPageDto extends (0, swagger_1.PartialType)(CreateCmsPageDto) {
}
exports.UpdateCmsPageDto = UpdateCmsPageDto;
class QueryCmsPageDto extends queryOptions_dto_1.QueryOptions {
    status;
    type;
    searchTerm;
}
exports.QueryCmsPageDto = QueryCmsPageDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: page_enum_1.CmsPageStatus, description: 'Filter pages by status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(page_enum_1.CmsPageStatus),
    __metadata("design:type", String)
], QueryCmsPageDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: page_enum_1.CmsPageType, description: 'Filter pages by lock type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(page_enum_1.CmsPageType),
    __metadata("design:type", String)
], QueryCmsPageDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fuzzy search by page title or slug' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryCmsPageDto.prototype, "searchTerm", void 0);
//# sourceMappingURL=page.dto.js.map