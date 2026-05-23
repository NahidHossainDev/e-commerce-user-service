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
exports.ReorderComponentsDto = exports.ReorderItemDto = exports.UpdateCmsComponentDto = exports.CreateCmsComponentDto = exports.ComponentSettingsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const component_enum_1 = require("../enums/component.enum");
class ComponentSettingsDto {
    container = 'boxed';
    fullWidth = false;
    backgroundColor;
    paddingTop;
    paddingBottom;
}
exports.ComponentSettingsDto = ComponentSettingsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Layout container type', default: 'boxed' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComponentSettingsDto.prototype, "container", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Force edge-to-edge content display', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ComponentSettingsDto.prototype, "fullWidth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'CSS background-color override' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComponentSettingsDto.prototype, "backgroundColor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'CSS padding-top value (e.g. 20px, 2rem)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComponentSettingsDto.prototype, "paddingTop", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'CSS padding-bottom value (e.g. 20px, 2rem)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComponentSettingsDto.prototype, "paddingBottom", void 0);
class CreateCmsComponentDto {
    componentType;
    order;
    isVisible = true;
    settings;
    data;
}
exports.CreateCmsComponentDto = CreateCmsComponentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: component_enum_1.CmsComponentType, description: 'Component renderer type' }),
    (0, class_validator_1.IsEnum)(component_enum_1.CmsComponentType),
    __metadata("design:type", String)
], CreateCmsComponentDto.prototype, "componentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Display order index number', minimum: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCmsComponentDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Visibility status flag', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateCmsComponentDto.prototype, "isVisible", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: ComponentSettingsDto, description: 'Component container settings' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ComponentSettingsDto),
    __metadata("design:type", ComponentSettingsDto)
], CreateCmsComponentDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Object, description: 'Dynamic component properties mapping' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateCmsComponentDto.prototype, "data", void 0);
class UpdateCmsComponentDto extends (0, swagger_1.PartialType)(CreateCmsComponentDto) {
}
exports.UpdateCmsComponentDto = UpdateCmsComponentDto;
class ReorderItemDto {
    id;
    order;
}
exports.ReorderItemDto = ReorderItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Database ID of the CmsComponent' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReorderItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New sequential order index mapping' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ReorderItemDto.prototype, "order", void 0);
class ReorderComponentsDto {
    components;
}
exports.ReorderComponentsDto = ReorderComponentsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ReorderItemDto], description: 'Ordered list of components' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReorderItemDto),
    __metadata("design:type", Array)
], ReorderComponentsDto.prototype, "components", void 0);
//# sourceMappingURL=component.dto.js.map