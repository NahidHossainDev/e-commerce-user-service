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
exports.CmsComponentsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const component_schema_1 = require("./schemas/component.schema");
let CmsComponentsRepository = class CmsComponentsRepository {
    componentModel;
    constructor(componentModel) {
        this.componentModel = componentModel;
    }
    async create(pageId, dto, session) {
        const component = new this.componentModel({
            ...dto,
            pageId: new mongoose_2.Types.ObjectId(pageId),
        });
        return await component.save({ session });
    }
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            return null;
        return await this.componentModel.findById(new mongoose_2.Types.ObjectId(id)).exec();
    }
    async findByPageId(pageId, filterVisible = false) {
        const filter = { pageId: new mongoose_2.Types.ObjectId(pageId) };
        if (filterVisible) {
            filter.isVisible = true;
        }
        return await this.componentModel
            .find(filter)
            .sort({ order: 1 })
            .lean()
            .exec();
    }
    async update(id, dto, session) {
        const updated = await this.componentModel
            .findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id) }, { $set: dto }, { new: true, session })
            .exec();
        if (!updated) {
            throw new common_1.NotFoundException(`CMS Component with ID ${id} not found`);
        }
        return updated;
    }
    async delete(id, session) {
        const deleted = await this.componentModel
            .findOneAndDelete({ _id: new mongoose_2.Types.ObjectId(id) }, { session })
            .exec();
        if (!deleted) {
            throw new common_1.NotFoundException(`CMS Component with ID ${id} not found`);
        }
        return deleted;
    }
    async deleteByPageId(pageId, session) {
        await this.componentModel
            .deleteMany({ pageId: new mongoose_2.Types.ObjectId(pageId) }, { session })
            .exec();
    }
    async reorder(components, session) {
        const bulkOps = components.map((c) => ({
            updateOne: {
                filter: { _id: new mongoose_2.Types.ObjectId(c.id) },
                update: { $set: { order: c.order } },
            },
        }));
        await this.componentModel.bulkWrite(bulkOps, { session });
    }
    async cloneComponents(sourcePageId, targetPageId, session) {
        const sourceComponents = await this.componentModel
            .find({ pageId: new mongoose_2.Types.ObjectId(sourcePageId) })
            .sort({ order: 1 })
            .exec();
        if (sourceComponents.length === 0)
            return [];
        const clones = sourceComponents.map((c) => {
            const obj = c.toObject();
            delete obj._id;
            delete obj.id;
            delete obj.createdAt;
            delete obj.updatedAt;
            return {
                ...obj,
                pageId: new mongoose_2.Types.ObjectId(targetPageId),
            };
        });
        return (await this.componentModel.insertMany(clones, { session }));
    }
};
exports.CmsComponentsRepository = CmsComponentsRepository;
exports.CmsComponentsRepository = CmsComponentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(component_schema_1.CmsComponent.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CmsComponentsRepository);
//# sourceMappingURL=components.repository.js.map