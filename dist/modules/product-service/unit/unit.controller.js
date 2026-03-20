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
const create_unit_dto_1 = require("./dto/create-unit.dto");
const unit_query_options_dto_1 = require("./dto/unit-query-options.dto");
const update_unit_dto_1 = require("./dto/update-unit.dto");
const unit_service_1 = require("./unit.service");
let UnitController = class UnitController {
    unitService;
    constructor(unitService) {
        this.unitService = unitService;
    }
    create(createUnitDto) {
        return this.unitService.create(createUnitDto);
    }
    findAll(query) {
        return this.unitService.findAll(query);
    }
    findOne(id) {
        return this.unitService.findOne(id);
    }
    update(id, updateUnitDto) {
        return this.unitService.update(id, updateUnitDto);
    }
    remove(id) {
        return this.unitService.remove(id);
    }
};
exports.UnitController = UnitController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new measurement unit' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The unit has been successfully created.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Unit name or symbol already exists.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_unit_dto_1.CreateUnitDto]),
    __metadata("design:returntype", void 0)
], UnitController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all measurement units' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [unit_query_options_dto_1.UnitQueryOptions]),
    __metadata("design:returntype", void 0)
], UnitController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a unit by ID' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Unit not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UnitController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a unit by ID' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Unit not found.' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Unit name or symbol already exists.',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_unit_dto_1.UpdateUnitDto]),
    __metadata("design:returntype", void 0)
], UnitController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a unit by ID' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Unit not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UnitController.prototype, "remove", null);
exports.UnitController = UnitController = __decorate([
    (0, swagger_1.ApiTags)('Units'),
    (0, common_1.Controller)('units'),
    __metadata("design:paramtypes", [unit_service_1.UnitService])
], UnitController);
//# sourceMappingURL=unit.controller.js.map