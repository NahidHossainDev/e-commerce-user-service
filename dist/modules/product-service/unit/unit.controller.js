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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_helper_1 = require("../../../utils/response/swagger.helper");
const create_unit_dto_1 = require("./dto/create-unit.dto");
const unit_response_dto_1 = require("./dto/unit-response.dto");
const unit_query_options_dto_1 = require("./dto/unit-query-options.dto");
const update_unit_dto_1 = require("./dto/update-unit.dto");
const unit_service_1 = require("./unit.service");
let UnitController = class UnitController {
    unitService;
    constructor(unitService) {
        this.unitService = unitService;
    }
    async create(createUnitDto) {
        return (await this.unitService.create(createUnitDto));
    }
    async findAll(query) {
        return (await this.unitService.findAll(query));
    }
    async findOne(id) {
        return (await this.unitService.findOne(id));
    }
    async update(id, updateUnitDto) {
        return (await this.unitService.update(id, updateUnitDto));
    }
    async remove(id) {
        return (await this.unitService.remove(id));
    }
};
exports.UnitController = UnitController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new measurement unit' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 201,
        description: 'The unit has been successfully created.',
        type: unit_response_dto_1.UnitResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_unit_dto_1.CreateUnitDto]),
    __metadata("design:returntype", Promise)
], UnitController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all measurement units' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Paginated list of units.',
        type: unit_response_dto_1.PaginatedUnitsResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [unit_query_options_dto_1.UnitQueryOptions]),
    __metadata("design:returntype", Promise)
], UnitController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a unit by ID' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'The unit has been successfully retrieved.',
        type: unit_response_dto_1.UnitResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a unit by ID' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'The unit has been successfully updated.',
        type: unit_response_dto_1.UnitResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_unit_dto_1.UpdateUnitDto]),
    __metadata("design:returntype", Promise)
], UnitController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a unit by ID' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'The unit has been successfully deleted.',
        type: unit_response_dto_1.UnitResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitController.prototype, "remove", null);
exports.UnitController = UnitController = __decorate([
    (0, swagger_1.ApiTags)('Units'),
    (0, common_1.Controller)('units'),
    __metadata("design:paramtypes", [unit_service_1.UnitService])
], UnitController);
//# sourceMappingURL=unit.controller.js.map