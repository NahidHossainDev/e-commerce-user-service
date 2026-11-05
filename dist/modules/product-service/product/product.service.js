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
const brand_service_1 = require("../brand/brand.service");
const category_service_1 = require("../category/category.service");
const inventory_service_1 = require("../inventory/inventory.service");
const inventory_history_schema_1 = require("../inventory/schemas/inventory-history.schema");
const product_constants_1 = require("./product.constants");
const product_schema_1 = require("./schemas/product.schema");
let ProductService = class ProductService {
    productModel;
    inventoryService;
    categoryService;
    brandService;
    eventEmitter;
    connection;
    constructor(productModel, inventoryService, categoryService, brandService, eventEmitter, connection) {
        this.productModel = productModel;
        this.inventoryService = inventoryService;
        this.categoryService = categoryService;
        this.brandService = brandService;
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
            const category = await this.categoryService.findOne(createProductDto.categoryId);
            const brand = createProductDto.brandId
                ? await this.brandService.findOne(createProductDto.brandId)
                : null;
            const sku = createProductDto.sku ||
                (0, product_helper_1.generateSKU)(brand?.name || 'GEN', category.name);
            const barcode = createProductDto.barcode === undefined ||
                createProductDto.barcode === null ||
                (typeof createProductDto.barcode === 'string' &&
                    createProductDto.barcode.trim() === '')
                ? undefined
                : createProductDto.barcode.trim();
            const cleanMedia = (createProductDto.media || []).filter((m) => m && typeof m.url === 'string' && m.url.trim() !== '');
            const normalizedPrice = this.normalizePrice(createProductDto.price);
            const product = new this.productModel({
                ...createProductDto,
                price: normalizedPrice,
                media: cleanMedia,
                slug,
                sku,
                barcode,
                stock: createProductDto.stock || 0,
                isInStock: (createProductDto.stock || 0) > 0,
            });
            const savedProduct = await product.save({ session });
            await this.inventoryService.create({
                productId: savedProduct._id.toString(),
                sku: savedProduct.sku,
                stockQuantity: createProductDto.stock || 0,
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
        const filterQuery = this.buildProductFilter(queryDto, true);
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        if (pagination.limit > 30) {
            pagination.limit = 30;
            pagination.skip = (pagination.page - 1) * pagination.limit;
        }
        this.applySorting(pagination);
        const result = await (0, getPaginatedData_1.getPaginatedData)({
            model: this.productModel,
            paginationQuery: pagination,
            filterQuery,
            populate: ['categoryId', 'brandId', 'subCategoryIds'],
        });
        result.data = result.data.map((item) => {
            const obj = item.toObject ? item.toObject() : { ...item };
            delete obj.vendorId;
            delete obj.isDeleted;
            delete obj.deletedAt;
            delete obj.lastStockSyncAt;
            if (obj.categoryId && !obj.category) {
                obj.category = obj.categoryId;
            }
            if (obj.brandId && !obj.brand) {
                obj.brand = obj.brandId;
            }
            if (obj.subCategoryIds && !obj.subCategories) {
                obj.subCategories = obj.subCategoryIds;
            }
            return obj;
        });
        return result;
    }
    async findAllAdmin(queryDto) {
        const paginateQueries = (0, helpers_1.pick)(queryDto, constants_1.paginateOptions);
        const filterQuery = this.buildProductFilter(queryDto, false);
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        this.applySorting(pagination);
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.productModel,
            paginationQuery: pagination,
            filterQuery,
            populate: [
                { path: 'categoryId', select: 'name' },
                { path: 'brandId', select: 'name logo' },
                { path: 'subCategoryIds', select: 'name' },
            ],
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
            .select('-vendorId -isDeleted -deletedAt -lastStockSyncAt -__v')
            .populate(['categoryId', 'brandId', 'subCategoryIds']);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async findOneAdmin(id) {
        const product = await this.productModel
            .findOne({
            _id: new mongoose_2.Types.ObjectId(id),
        })
            .populate(['categoryId', 'brandId', 'subCategoryIds']);
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
        if (updateProductDto.media) {
            updateData.media = updateProductDto.media.filter((m) => m && typeof m.url === 'string' && m.url.trim() !== '');
        }
        if (updateProductDto.title) {
            updateData.slug = (0, product_helper_1.generateSlug)(updateProductDto.title);
        }
        if (updateProductDto.price) {
            const existingPrice = oldProduct.price
                ? typeof oldProduct.price.toObject === 'function'
                    ? oldProduct.price.toObject()
                    : oldProduct.price
                : {};
            updateData.price = this.normalizePrice({
                ...existingPrice,
                ...updateProductDto.price,
            });
        }
        const updateQuery = {};
        const unsetQuery = {};
        if (updateProductDto.barcode === null ||
            (typeof updateProductDto.barcode === 'string' &&
                updateProductDto.barcode.trim() === '')) {
            delete updateData.barcode;
            unsetQuery.barcode = '';
        }
        else if (updateProductDto.barcode !== undefined) {
            updateData.barcode = updateProductDto.barcode.trim();
        }
        if (Object.keys(updateData).length > 0) {
            updateQuery.$set = updateData;
        }
        if (Object.keys(unsetQuery).length > 0) {
            updateQuery.$unset = unsetQuery;
        }
        const product = await this.productModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id) }, updateQuery, { new: true });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (updateProductDto.thumbnail &&
            updateProductDto.thumbnail !== oldProduct.thumbnail) {
            this.emitMediaEvents(oldProduct, 'detach', true);
            this.emitMediaEvents(product, 'attach', true);
        }
        if (updateProductDto.media) {
            const oldMediaUrls = new Set((oldProduct.media || []).map((m) => m.url));
            const newMediaUrls = new Set((product.media || []).map((m) => m.url));
            (oldProduct.media || []).forEach((m) => {
                if (!newMediaUrls.has(m.url)) {
                    const mediaId = (0, media_helper_1.extractMediaIdFromUrl)(m.url);
                    if (mediaId) {
                        this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_DETACHED, new media_events_1.ImageDetachedEvent(mediaId));
                    }
                }
            });
            (product.media || []).forEach((m) => {
                if (!oldMediaUrls.has(m.url)) {
                    const mediaId = (0, media_helper_1.extractMediaIdFromUrl)(m.url);
                    if (mediaId) {
                        this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_ATTACHED, new media_events_1.ImageAttachedEvent(mediaId, product._id.toString(), 'product'));
                    }
                }
            });
        }
        return product;
    }
    async remove(id) {
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
    async findByIds(ids) {
        if (!ids || ids.length === 0) {
            return [];
        }
        const safeIds = ids.slice(0, 30);
        const objectIds = safeIds
            .filter((id) => mongoose_2.Types.ObjectId.isValid(id))
            .map((id) => new mongoose_2.Types.ObjectId(id));
        const products = await this.productModel
            .find({
            _id: { $in: objectIds },
            isDeleted: false,
        })
            .select('-vendorId -isDeleted -deletedAt -lastStockSyncAt -__v')
            .populate(['categoryId', 'brandId', 'subCategoryIds'])
            .exec();
        const productMap = new Map(products.map((product) => [
            product._id.toString(),
            product,
        ]));
        const result = [];
        for (const id of safeIds) {
            const found = productMap.get(id);
            if (found) {
                result.push(found);
            }
        }
        return result;
    }
    buildProductFilter(query, isPublic = true) {
        const filter = {};
        if (isPublic) {
            filter.isDeleted = false;
            filter.status = query.status
                ? query.status
                : product_schema_1.ProductStatus.ACTIVE;
        }
        else {
            if (query.status) {
                filter.status = query.status;
            }
        }
        if (query.vendorId && mongoose_2.Types.ObjectId.isValid(query.vendorId)) {
            filter.vendorId = new mongoose_2.Types.ObjectId(query.vendorId);
        }
        const normalizeToArray = (val) => {
            if (!val)
                return [];
            if (Array.isArray(val)) {
                return val
                    .flatMap((v) => (typeof v === 'string' ? v.split(',') : [v]))
                    .map((s) => String(s).trim())
                    .filter(Boolean);
            }
            if (typeof val === 'string') {
                return val
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
            }
            return [String(val)];
        };
        const brandRaw = query.brandId || query.brand;
        const brandVals = normalizeToArray(brandRaw);
        if (brandVals.length > 0) {
            const objectIds = brandVals
                .filter((id) => mongoose_2.Types.ObjectId.isValid(id))
                .map((id) => new mongoose_2.Types.ObjectId(id));
            const matchValues = [...brandVals, ...objectIds];
            filter.$and = filter.$and || [];
            filter.$and.push({
                $or: [
                    { 'brand.id': { $in: matchValues } },
                    { 'brand._id': { $in: matchValues } },
                    { brand: { $in: matchValues } },
                    { brandId: { $in: matchValues } },
                ],
            });
        }
        const catRaw = query.categoryId || query.category;
        const catVals = normalizeToArray(catRaw);
        if (catVals.length > 0) {
            const objectIds = catVals
                .filter((id) => mongoose_2.Types.ObjectId.isValid(id))
                .map((id) => new mongoose_2.Types.ObjectId(id));
            const matchValues = [...catVals, ...objectIds];
            filter.$and = filter.$and || [];
            filter.$and.push({
                $or: [
                    { 'category.id': { $in: matchValues } },
                    { 'category._id': { $in: matchValues } },
                    { category: { $in: matchValues } },
                    { categoryId: { $in: matchValues } },
                    { 'subCategories.id': { $in: matchValues } },
                    { 'subCategories._id': { $in: matchValues } },
                    { subCategoryIds: { $in: matchValues } },
                ],
            });
        }
        if (query.searchTerm && query.searchTerm.trim()) {
            const term = query.searchTerm.trim();
            const regex = new RegExp(term, 'i');
            const searchConditions = [
                { title: { $regex: regex } },
                { description: { $regex: regex } },
                { tags: { $in: [regex] } },
                { keywords: { $in: [regex] } },
            ];
            if (mongoose_2.Types.ObjectId.isValid(term)) {
                searchConditions.push({ _id: new mongoose_2.Types.ObjectId(term) });
            }
            filter.$and = filter.$and || [];
            filter.$and.push({ $or: searchConditions });
        }
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            const priceCond = {};
            if (query.minPrice !== undefined && !isNaN(Number(query.minPrice))) {
                priceCond.$gte = Number(query.minPrice);
            }
            if (query.maxPrice !== undefined && !isNaN(Number(query.maxPrice))) {
                priceCond.$lte = Number(query.maxPrice);
            }
            if (Object.keys(priceCond).length > 0) {
                filter.$and = filter.$and || [];
                filter.$and.push({
                    $or: [
                        { 'price.discountPrice': priceCond },
                        { 'price.basePrice': priceCond },
                    ],
                });
            }
        }
        if (typeof query.isOnOffer === 'boolean')
            filter.isOnOffer = query.isOnOffer;
        if (typeof query.isBestSeller === 'boolean')
            filter.isBestSeller = query.isBestSeller;
        if (typeof query.isFeatured === 'boolean')
            filter.isFeatured = query.isFeatured;
        if (typeof query.isNew === 'boolean')
            filter.isNew = query.isNew;
        if (typeof query.isPerishable === 'boolean')
            filter.isPerishable = query.isPerishable;
        return filter;
    }
    applySorting(pagination) {
        if (pagination.sortBy && product_constants_1.PRODUCT_SORT_OPTIONS[pagination.sortBy]) {
            const sortOption = product_constants_1.PRODUCT_SORT_OPTIONS[pagination.sortBy];
            const field = Object.keys(sortOption)[0];
            pagination.sortBy = field;
            pagination.sortOrder = sortOption[field];
        }
        else if (pagination.sortBy === 'price') {
            pagination.sortBy = 'price.basePrice';
        }
    }
    normalizePrice(price) {
        if (!price) {
            throw new common_1.BadRequestException('Product price is required');
        }
        const basePrice = Number(price.basePrice);
        if (isNaN(basePrice) || basePrice < 0) {
            throw new common_1.BadRequestException('Base price must be a valid non-negative number');
        }
        let discountPrice = price.discountPrice !== undefined &&
            price.discountPrice !== null &&
            price.discountPrice !== ''
            ? Number(price.discountPrice)
            : undefined;
        let discountRate = price.discountRate !== undefined &&
            price.discountRate !== null &&
            price.discountRate !== ''
            ? Number(price.discountRate)
            : undefined;
        if (discountPrice !== undefined) {
            if (isNaN(discountPrice) || discountPrice < 0) {
                throw new common_1.BadRequestException('Discount price cannot be negative');
            }
            if (discountPrice > basePrice) {
                throw new common_1.BadRequestException('Discount price cannot exceed base price');
            }
            if (discountPrice === basePrice) {
                discountPrice = undefined;
                discountRate = 0;
            }
            else {
                discountRate =
                    basePrice > 0
                        ? Math.round(((basePrice - discountPrice) / basePrice) * 100)
                        : 0;
            }
        }
        else if (discountRate !== undefined && discountRate > 0) {
            if (isNaN(discountRate) || discountRate < 0 || discountRate > 100) {
                throw new common_1.BadRequestException('Discount rate must be between 0 and 100');
            }
            discountPrice = Math.round(basePrice * (1 - discountRate / 100) * 100) / 100;
        }
        else {
            discountPrice = undefined;
            discountRate = 0;
        }
        return {
            ...price,
            basePrice,
            discountPrice,
            discountRate: discountRate ?? 0,
            currency: price.currency || constants_1.DEFAULT_CURRENCY,
        };
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
    __param(5, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        inventory_service_1.InventoryService,
        category_service_1.CategoryService,
        brand_service_1.BrandService,
        event_emitter_1.EventEmitter2,
        mongoose_2.Connection])
], ProductService);
//# sourceMappingURL=product.service.js.map