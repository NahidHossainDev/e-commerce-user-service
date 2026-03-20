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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../../common/constants");
const media_events_1 = require("../../../common/events/media.events");
const helpers_1 = require("../../../utils/helpers");
const media_helper_1 = require("../../../utils/helpers/media-helper");
const getPaginatedData_1 = require("../../../utils/mongodb/getPaginatedData");
const category_constants_1 = require("./category.constants");
const category_utils_1 = require("./category.utils");
const category_schema_1 = require("./schemas/category.schema");
let CategoryService = class CategoryService {
    categoryModel;
    eventEmitter;
    constructor(categoryModel, eventEmitter) {
        this.categoryModel = categoryModel;
        this.eventEmitter = eventEmitter;
    }
    async create(createCategoryDto) {
        const slug = (0, helpers_1.createSlug)(createCategoryDto.name);
        const existingCategory = await this.categoryModel.findOne({
            $or: [{ name: createCategoryDto.name }, { slug }],
        });
        if (existingCategory) {
            throw new common_1.ConflictException('Category with this name or slug already exists');
        }
        let level = 0;
        let path = ',';
        if (createCategoryDto.parentCategory) {
            const parent = await this.categoryModel.findById(createCategoryDto.parentCategory);
            if (!parent) {
                throw new common_1.NotFoundException('Parent category not found');
            }
            level = parent.level + 1;
            path = `${parent.path}${parent._id.toString()},`;
            if (level > 3) {
                throw new common_1.ConflictException('Category depth cannot exceed 3 levels');
            }
        }
        const savedCategory = await this.categoryModel.create({
            ...createCategoryDto,
            slug,
            level,
            path,
        });
        if (savedCategory.image) {
            const mediaId = (0, media_helper_1.extractMediaIdFromUrl)(savedCategory.image);
            if (mediaId) {
                this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_ATTACHED, new media_events_1.ImageAttachedEvent(mediaId, savedCategory._id.toString(), 'category'));
            }
        }
        return savedCategory;
    }
    async findAll(query) {
        const paginateQueries = (0, helpers_1.pick)(query, constants_1.paginateOptions);
        const filterQuery = (0, helpers_1.pick)(query, category_constants_1.categoryFilterableFields);
        if (filterQuery.searchTerm) {
            filterQuery.$or = category_constants_1.categorySearchableFields.map((field) => ({
                [field]: { $regex: filterQuery.searchTerm, $options: 'i' },
            }));
            delete filterQuery.searchTerm;
        }
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.categoryModel,
            paginationQuery: pagination,
            filterQuery,
        });
    }
    async findOne(id) {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        const category = await this.categoryModel.findById(id);
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        const updateData = { ...updateCategoryDto };
        if (updateCategoryDto.name) {
            const slug = (0, helpers_1.createSlug)(updateCategoryDto.name);
            const existingCategory = await this.categoryModel.findOne({
                $or: [{ name: updateCategoryDto.name }, { slug }],
                _id: { $ne: id },
            });
            if (existingCategory) {
                throw new common_1.ConflictException('Category with this name or slug already exists');
            }
            updateData.slug = slug;
        }
        if (updateCategoryDto.sortOrder !== undefined) {
            updateData.sortOrder = updateCategoryDto.sortOrder;
        }
        if (updateCategoryDto.parentCategory !== undefined) {
            let newLevel = 0;
            let newPath = ',';
            if (updateCategoryDto.parentCategory) {
                if (updateCategoryDto.parentCategory === id) {
                    throw new common_1.ConflictException('Category cannot be its own parent');
                }
                const parent = await this.categoryModel.findById(updateCategoryDto.parentCategory);
                if (!parent) {
                    throw new common_1.NotFoundException('Parent category not found');
                }
                if (parent.path.includes(`,${id},`)) {
                    throw new common_1.ConflictException('Cannot move category to one of its descendants');
                }
                newLevel = parent.level + 1;
                newPath = `${parent.path}${parent._id.toString()},`;
                if (newLevel > 3) {
                    throw new common_1.ConflictException('Category depth cannot exceed 3 levels');
                }
            }
            if (category.parentCategory?.toString() !== updateCategoryDto.parentCategory) {
                const oldPath = `${category.path}${category._id.toString()},`;
                const nextPath = `${newPath}${category._id.toString()},`;
                await this.categoryModel.updateMany({ path: { $regex: `^${oldPath}` } }, [
                    {
                        $set: {
                            path: {
                                $replaceOne: {
                                    input: '$path',
                                    find: oldPath,
                                    replacement: nextPath,
                                },
                            },
                            level: {
                                $add: ['$level', newLevel - category.level],
                            },
                        },
                    },
                ]);
                updateData.level = newLevel;
                updateData.path = newPath;
            }
        }
        const updatedCategory = await this.categoryModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
        if (!updatedCategory) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        if (updateCategoryDto.image && updateCategoryDto.image !== category.image) {
            const oldId = (0, media_helper_1.extractMediaIdFromUrl)(category.image);
            const newId = (0, media_helper_1.extractMediaIdFromUrl)(updateCategoryDto.image);
            const categoryId = updatedCategory._id.toString();
            if (oldId) {
                this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_DETACHED, new media_events_1.ImageDetachedEvent(oldId));
            }
            if (newId) {
                this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_ATTACHED, new media_events_1.ImageAttachedEvent(newId, categoryId, 'category'));
            }
        }
        return updatedCategory;
    }
    async remove(id) {
        const category = await this.categoryModel.findById(id);
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        const childCount = await this.categoryModel.countDocuments({
            parentCategory: id,
        });
        if (childCount > 0) {
            throw new common_1.ConflictException('Cannot delete category with sub-categories');
        }
        const deletedCategory = await this.categoryModel
            .findByIdAndDelete(id)
            .exec();
        if (!deletedCategory) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        if (deletedCategory.image) {
            const mediaId = (0, media_helper_1.extractMediaIdFromUrl)(deletedCategory.image);
            if (mediaId) {
                this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_DETACHED, new media_events_1.ImageDetachedEvent(mediaId));
            }
        }
        return deletedCategory;
    }
    async findAllPublic() {
        return this.categoryModel
            .find({ isActive: true })
            .sort({ sortOrder: 1 })
            .exec();
    }
    async getPublicCategoryTree() {
        const categories = await this.categoryModel
            .find({ isActive: true })
            .sort({ sortOrder: 1 })
            .exec();
        return (0, category_utils_1.buildCategoryTree)(categories);
    }
    async getBySlug(slug) {
        const category = await this.categoryModel.findOne({ slug }).exec();
        if (!category) {
            throw new common_1.NotFoundException(`Category with slug ${slug} not found`);
        }
        return category;
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        event_emitter_1.EventEmitter2])
], CategoryService);
//# sourceMappingURL=category.service.js.map