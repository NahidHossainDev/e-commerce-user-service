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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../../common/constants");
const media_events_1 = require("../../../common/events/media.events");
const helpers_1 = require("../../../utils/helpers");
const media_helper_1 = require("../../../utils/helpers/media-helper");
const getPaginatedData_1 = require("../../../utils/mongodb/getPaginatedData");
const product_helper_1 = require("../../../utils/product-helper");
const inventory_service_1 = require("../inventory/inventory.service");
const inventory_history_schema_1 = require("../inventory/schemas/inventory-history.schema");
const product_constants_1 = require("./product.constants");
const product_schema_1 = require("./schemas/product.schema");
let ProductService = class ProductService {
    productModel;
    inventoryService;
    eventEmitter;
    connection;
    constructor(productModel, inventoryService, eventEmitter, connection) {
        this.productModel = productModel;
        this.inventoryService = inventoryService;
        this.eventEmitter = eventEmitter;
        this.connection = connection;
    }
    async create(createProductDto) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const slug = (0, product_helper_1.generateSlug)(createProductDto.title);
            const existing = await this.productModel
                .findOne({ slug })
                .session(session);
            if (existing) {
                throw new common_1.ConflictException('Product with this title already exists');
            }
            const sku = createProductDto.sku ||
                (0, product_helper_1.generateSKU)(createProductDto.brand?.name || 'GEN', createProductDto.category.name);
            const product = new this.productModel({
                ...createProductDto,
                slug,
                sku,
                stock: createProductDto.initialStock || 0,
                isInStock: (createProductDto.initialStock || 0) > 0,
            });
            const savedProduct = await product.save({ session });
            await this.inventoryService.create({
                productId: savedProduct._id.toString(),
                sku: savedProduct.sku,
                stockQuantity: createProductDto.initialStock || 0,
                lowStockThreshold: 5,
                variantStock: createProductDto.variants?.map((v) => ({
                    variantSku: v.sku ||
                        `${savedProduct.sku}-${v.name.substring(0, 3).toUpperCase()}`,
                    stockQuantity: 0,
                })) || [],
            }, session);
            await session.commitTransaction();
            this.emitMediaEvents(savedProduct, 'attach');
            return savedProduct;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    }
    async findAllPublic(queryDto) {
        const paginateQueries = (0, helpers_1.pick)(queryDto, constants_1.paginateOptions);
        const filters = (0, helpers_1.pick)(queryDto, product_constants_1.PRODUCT_FILTER_FIELDS);
        const { searchTerm, categoryId, brandId, minPrice, maxPrice, ...remainingFilters } = filters;
        const filterQuery = {
            isDeleted: false,
            status: product_schema_1.ProductStatus.ACTIVE,
            ...remainingFilters,
        };
        this.applySearchFilters(filterQuery, searchTerm);
        this.applyIdFilters(filterQuery, categoryId, brandId);
        this.applyPriceFilters(filterQuery, minPrice, maxPrice);
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        this.applySorting(pagination);
        const result = await (0, getPaginatedData_1.getPaginatedData)({
            model: this.productModel,
            paginationQuery: pagination,
            filterQuery,
        });
        result.data = result.data.map((item) => {
            const obj = item.toObject ? item.toObject() : item;
            delete obj.vendorId;
            delete obj.isDeleted;
            delete obj.deletedAt;
            delete obj.lastStockSyncAt;
            return obj;
        });
        return result;
    }
    async findAllAdmin(queryDto) {
        const paginateQueries = (0, helpers_1.pick)(queryDto, constants_1.paginateOptions);
        const filters = (0, helpers_1.pick)(queryDto, product_constants_1.PRODUCT_FILTER_FIELDS);
        const { searchTerm, categoryId, brandId, vendorId, minPrice, maxPrice, ...remainingFilters } = filters;
        const filterQuery = {
            ...remainingFilters,
        };
        if (vendorId)
            filterQuery.vendorId = new mongoose_2.Types.ObjectId(vendorId);
        this.applySearchFilters(filterQuery, searchTerm);
        this.applyIdFilters(filterQuery, categoryId, brandId);
        this.applyPriceFilters(filterQuery, minPrice, maxPrice);
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        this.applySorting(pagination);
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.productModel,
            paginationQuery: pagination,
            filterQuery,
        });
    }
    async findOnePublic(idOrSlug) {
        const query = mongoose_2.Types.ObjectId.isValid(idOrSlug)
            ? { _id: new mongoose_2.Types.ObjectId(idOrSlug) }
            : { slug: idOrSlug };
        const product = await this.productModel
            .findOne({
            ...query,
            isDeleted: false,
            status: product_schema_1.ProductStatus.ACTIVE,
        })
            .select('-vendorId -isDeleted -deletedAt -lastStockSyncAt -__v');
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async findOneAdmin(id) {
        const product = await this.productModel.findOne({
            _id: new mongoose_2.Types.ObjectId(id),
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async update(id, updateProductDto) {
        const oldProduct = await this.findOneAdmin(id);
        const updateData = {
            ...updateProductDto,
        };
        if (updateProductDto.title) {
            updateData.slug = (0, product_helper_1.generateSlug)(updateProductDto.title);
        }
        const product = await this.productModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id) }, { $set: updateData }, { new: true });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (updateProductDto.thumbnail &&
            updateProductDto.thumbnail !== oldProduct.thumbnail) {
            this.emitMediaEvents(oldProduct, 'detach', true);
            this.emitMediaEvents(product, 'attach', true);
        }
        return product;
    }
    async remove(id) {
        const product = await this.findOneAdmin(id);
        const result = await this.productModel.updateOne({ _id: new mongoose_2.Types.ObjectId(id) }, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                status: product_schema_1.ProductStatus.ARCHIVED,
            },
        });
        if (result.matchedCount === 0) {
            throw new common_1.NotFoundException('Product not found');
        }
        this.emitMediaEvents(product, 'detach');
    }
    async hardDelete(id) {
        const product = await this.findOneAdmin(id);
        const result = await this.productModel.deleteOne({
            _id: new mongoose_2.Types.ObjectId(id),
        });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Product not found');
        }
        this.emitMediaEvents(product, 'detach');
    }
    async updateStatus(id, status) {
        const product = await this.productModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id) }, { $set: { status } }, { new: true });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async restore(id) {
        const product = await this.productModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), isDeleted: true }, {
            $set: {
                isDeleted: false,
                deletedAt: null,
                status: product_schema_1.ProductStatus.DRAFT,
            },
        }, { new: true });
        if (!product) {
            throw new common_1.NotFoundException('Product not found or not deleted');
        }
        return product;
    }
    async bulkUpdateStatus(ids, status) {
        return this.productModel.updateMany({ _id: { $in: ids.map((id) => new mongoose_2.Types.ObjectId(id)) } }, { $set: { status } });
    }
    async updateStock(productId, quantityChange) {
        await this.inventoryService.adjustStock(productId, {
            quantity: quantityChange,
            type: quantityChange > 0
                ? inventory_history_schema_1.InventoryTransactionType.RESTOCK
                : inventory_history_schema_1.InventoryTransactionType.SALE,
            reason: 'Manual adjustment via Product Service',
        });
    }
    applySearchFilters(filterQuery, searchTerm) {
        if (searchTerm) {
            filterQuery['$or'] = product_constants_1.PRODUCT_SEARCH_FIELDS.map((field) => ({
                [field]: { $regex: searchTerm, $options: 'i' },
            }));
        }
    }
    applyIdFilters(filterQuery, categoryId, brandId) {
        if (categoryId)
            filterQuery['category.id'] = new mongoose_2.Types.ObjectId(categoryId);
        if (brandId)
            filterQuery['brand.id'] = new mongoose_2.Types.ObjectId(brandId);
    }
    applyPriceFilters(filterQuery, minPrice, maxPrice) {
        if (minPrice !== undefined || maxPrice !== undefined) {
            filterQuery['price.basePrice'] = {
                ...(minPrice !== undefined && { $gte: minPrice }),
                ...(maxPrice !== undefined && { $lte: maxPrice }),
            };
        }
    }
    applySorting(pagination) {
        if (pagination.sortBy && product_constants_1.PRODUCT_SORT_OPTIONS[pagination.sortBy]) {
            const sortOption = product_constants_1.PRODUCT_SORT_OPTIONS[pagination.sortBy];
            const field = Object.keys(sortOption)[0];
            pagination.sortBy = field;
            pagination.sortOrder = sortOption[field];
        }
    }
    emitMediaEvents(product, type, thumbnailOnly = false) {
        const productId = product._id.toString();
        const thumbnailId = (0, media_helper_1.extractMediaIdFromUrl)(product.thumbnail);
        if (thumbnailId) {
            this.eventEmitter.emit(type === 'attach'
                ? media_events_1.MediaEvent.IMAGE_ATTACHED
                : media_events_1.MediaEvent.IMAGE_DETACHED, type === 'attach'
                ? new media_events_1.ImageAttachedEvent(thumbnailId, productId, 'product')
                : new media_events_1.ImageDetachedEvent(thumbnailId));
        }
        if (!thumbnailOnly && product.media && product.media.length > 0) {
            product.media.forEach((m) => {
                const mediaId = (0, media_helper_1.extractMediaIdFromUrl)(m.url);
                if (mediaId) {
                    this.eventEmitter.emit(type === 'attach'
                        ? media_events_1.MediaEvent.IMAGE_ATTACHED
                        : media_events_1.MediaEvent.IMAGE_DETACHED, type === 'attach'
                        ? new media_events_1.ImageAttachedEvent(mediaId, productId, 'product')
                        : new media_events_1.ImageDetachedEvent(mediaId));
                }
            });
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(3, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        inventory_service_1.InventoryService,
        event_emitter_1.EventEmitter2,
        mongoose_2.Connection])
], ProductService);
//# sourceMappingURL=product.service.js.map