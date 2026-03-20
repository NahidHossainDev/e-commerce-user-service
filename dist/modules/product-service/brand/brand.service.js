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
exports.BrandService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../../common/constants");
const media_events_1 = require("../../../common/events/media.events");
const helpers_1 = require("../../../utils/helpers");
const media_helper_1 = require("../../../utils/helpers/media-helper");
const getPaginatedData_1 = require("../../../utils/mongodb/getPaginatedData");
const brand_schema_1 = require("./schemas/brand.schema");
let BrandService = class BrandService {
    brandModel;
    eventEmitter;
    constructor(brandModel, eventEmitter) {
        this.brandModel = brandModel;
        this.eventEmitter = eventEmitter;
    }
    async create(createBrandDto) {
        const slug = (0, helpers_1.createSlug)(createBrandDto.name);
        const existingBrand = await this.brandModel.findOne({
            $or: [{ name: createBrandDto.name }, { slug }],
        });
        if (existingBrand) {
            throw new common_1.ConflictException('Brand with this name or slug already exists');
        }
        const savedBrand = await this.brandModel.create({
            ...createBrandDto,
            slug,
        });
        if (savedBrand.logo) {
            const mediaId = (0, media_helper_1.extractMediaIdFromUrl)(savedBrand.logo);
            if (mediaId) {
                this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_ATTACHED, new media_events_1.ImageAttachedEvent(mediaId, savedBrand._id.toString(), 'brand'));
            }
        }
        return savedBrand;
    }
    async findAll(query) {
        const paginateQueries = (0, helpers_1.pick)(query, constants_1.paginateOptions);
        const filterQuery = (0, helpers_1.pick)(query, ['searchTerm', 'isActive']);
        if (filterQuery.searchTerm) {
            filterQuery.$text = { $search: filterQuery.searchTerm };
            delete filterQuery.searchTerm;
        }
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.brandModel,
            paginationQuery: pagination,
            filterQuery,
        });
    }
    async findOne(id) {
        const brand = await this.brandModel.findById(id).exec();
        if (!brand) {
            throw new common_1.NotFoundException(`Brand with ID ${id} not found`);
        }
        return brand;
    }
    async update(id, updateBrandDto) {
        const updateData = { ...updateBrandDto };
        if (updateBrandDto.name) {
            const slug = (0, helpers_1.createSlug)(updateBrandDto.name);
            const existingBrand = await this.brandModel.findOne({
                $or: [{ name: updateBrandDto.name }, { slug }],
                _id: { $ne: id },
            });
            if (existingBrand) {
                throw new common_1.ConflictException('Brand with this name or slug already exists');
            }
            updateData.slug = slug;
        }
        const oldBrand = await this.brandModel.findById(id);
        if (!oldBrand) {
            throw new common_1.NotFoundException(`Brand with ID ${id} not found`);
        }
        const updatedBrand = await this.brandModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
        if (!updatedBrand) {
            throw new common_1.NotFoundException(`Brand with ID ${id} not found`);
        }
        if (updateBrandDto.logo && updateBrandDto.logo !== oldBrand.logo) {
            const oldId = (0, media_helper_1.extractMediaIdFromUrl)(oldBrand.logo);
            const newId = (0, media_helper_1.extractMediaIdFromUrl)(updateBrandDto.logo);
            const brandId = updatedBrand._id.toString();
            if (oldId) {
                this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_DETACHED, new media_events_1.ImageDetachedEvent(oldId));
            }
            if (newId) {
                this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_ATTACHED, new media_events_1.ImageAttachedEvent(newId, brandId, 'brand'));
            }
        }
        return updatedBrand;
    }
    async remove(id) {
        const brand = await this.brandModel.findById(id);
        if (!brand) {
            throw new common_1.NotFoundException(`Brand with ID ${id} not found`);
        }
        const result = await this.brandModel.findByIdAndDelete(id).exec();
        if (brand.logo) {
            const mediaId = (0, media_helper_1.extractMediaIdFromUrl)(brand.logo);
            if (mediaId) {
                this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_DETACHED, new media_events_1.ImageDetachedEvent(mediaId));
            }
        }
        return result;
    }
};
exports.BrandService = BrandService;
exports.BrandService = BrandService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(brand_schema_1.Brand.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        event_emitter_1.EventEmitter2])
], BrandService);
//# sourceMappingURL=brand.service.js.map