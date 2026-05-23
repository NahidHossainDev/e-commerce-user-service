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
exports.CmsPagesRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const helpers_1 = require("../../../utils/helpers");
const getPaginatedData_1 = require("../../../utils/mongodb/getPaginatedData");
const page_schema_1 = require("./schemas/page.schema");
let CmsPagesRepository = class CmsPagesRepository {
    pageModel;
    constructor(pageModel) {
        this.pageModel = pageModel;
    }
    async create(dto, session) {
        const page = new this.pageModel(dto);
        return await page.save({ session });
    }
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            return null;
        return await this.pageModel.findById(new mongoose_2.Types.ObjectId(id)).exec();
    }
    async findBySlug(slug) {
        return await this.pageModel.findOne({ slug: slug.toLowerCase() }).exec();
    }
    async findHomePage() {
        return await this.pageModel.findOne({ isHomePage: true }).exec();
    }
    async update(id, dto, session) {
        const updated = await this.pageModel
            .findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id) }, { $set: dto }, { new: true, session })
            .exec();
        if (!updated) {
            throw new common_1.NotFoundException(`CMS Page with ID ${id} not found`);
        }
        return updated;
    }
    async delete(id, session) {
        const deleted = await this.pageModel
            .findOneAndDelete({ _id: new mongoose_2.Types.ObjectId(id) }, { session })
            .exec();
        if (!deleted) {
            throw new common_1.NotFoundException(`CMS Page with ID ${id} not found`);
        }
        return deleted;
    }
    async findAll(queryDto) {
        const pagination = helpers_1.paginationHelpers.calculatePagination({
            page: queryDto.page,
            limit: queryDto.limit,
            sortBy: queryDto.sortBy || 'createdAt',
            sortOrder: queryDto.sortOrder || 'desc',
        });
        const filterQuery = {};
        if (queryDto.status) {
            filterQuery.status = queryDto.status;
        }
        if (queryDto.type) {
            filterQuery.type = queryDto.type;
        }
        if (queryDto.searchTerm) {
            filterQuery.$or = [
                { title: { $regex: queryDto.searchTerm, $options: 'i' } },
                { slug: { $regex: queryDto.searchTerm, $options: 'i' } },
            ];
        }
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.pageModel,
            paginationQuery: pagination,
            filterQuery,
        });
    }
    async unsetHomePage(exceptId, session) {
        await this.pageModel
            .updateMany({ _id: { $ne: new mongoose_2.Types.ObjectId(exceptId) }, isHomePage: true }, { $set: { isHomePage: false } }, { session })
            .exec();
    }
};
exports.CmsPagesRepository = CmsPagesRepository;
exports.CmsPagesRepository = CmsPagesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(page_schema_1.CmsPage.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CmsPagesRepository);
//# sourceMappingURL=pages.repository.js.map