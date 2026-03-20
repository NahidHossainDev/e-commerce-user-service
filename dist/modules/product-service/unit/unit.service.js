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
exports.UnitService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../../common/constants");
const helpers_1 = require("../../../utils/helpers");
const getPaginatedData_1 = require("../../../utils/mongodb/getPaginatedData");
const unit_schema_1 = require("./schemas/unit.schema");
let UnitService = class UnitService {
    unitModel;
    constructor(unitModel) {
        this.unitModel = unitModel;
    }
    async create(createUnitDto) {
        const createdUnit = new this.unitModel(createUnitDto);
        return await createdUnit.save();
    }
    async findAll(query) {
        const paginateQueries = (0, helpers_1.pick)(query, constants_1.paginateOptions);
        const filters = (0, helpers_1.pick)(query, ['searchTerm', 'category']);
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        const { searchTerm, ...filterData } = filters;
        const andConditions = [];
        if (searchTerm) {
            andConditions.push({
                $or: ['name', 'symbol'].map((field) => ({
                    [field]: {
                        $regex: searchTerm,
                        $options: 'i',
                    },
                })),
            });
        }
        if (Object.keys(filterData).length) {
            andConditions.push({
                $and: Object.entries(filterData).map(([field, value]) => ({
                    [field]: value,
                })),
            });
        }
        const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.unitModel,
            paginationQuery: pagination,
            filterQuery: whereConditions,
        });
    }
    async findOne(id) {
        const unit = await this.unitModel.findById(id).exec();
        if (!unit) {
            throw new common_1.NotFoundException(`Unit with ID ${id} not found`);
        }
        return unit;
    }
    async update(id, updateUnitDto) {
        const updatedUnit = await this.unitModel
            .findByIdAndUpdate(id, updateUnitDto, { new: true })
            .exec();
        if (!updatedUnit) {
            throw new common_1.NotFoundException(`Unit with ID ${id} not found`);
        }
        return updatedUnit;
    }
    async remove(id) {
        const deletedUnit = await this.unitModel.findByIdAndDelete(id).exec();
        if (!deletedUnit) {
            throw new common_1.NotFoundException(`Unit with ID ${id} not found`);
        }
        return deletedUnit;
    }
};
exports.UnitService = UnitService;
exports.UnitService = UnitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(unit_schema_1.Unit.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UnitService);
//# sourceMappingURL=unit.service.js.map