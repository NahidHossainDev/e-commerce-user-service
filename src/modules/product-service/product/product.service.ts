import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, FilterQuery, Model, Types } from 'mongoose';
import { paginateOptions } from '../../../common/constants';
import {
  ImageAttachedEvent,
  ImageDetachedEvent,
  MediaEvent,
} from '../../../common/events/media.events';
import { paginationHelpers, pick } from '../../../utils/helpers';
import { extractMediaIdFromUrl } from '../../../utils/helpers/media-helper';
import { getPaginatedData } from '../../../utils/mongodb/getPaginatedData';
import { generateSKU, generateSlug } from '../../../utils/product-helper';
import { BrandService } from '../brand/brand.service';
import { CategoryService } from '../category/category.service';
import { InventoryService } from '../inventory/inventory.service';
import { InventoryTransactionType } from '../inventory/schemas/inventory-history.schema';

import { ProductQueryDto } from './dto/product-query-options.dto';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import {
  PRODUCT_FILTER_FIELDS,
  PRODUCT_SEARCH_FIELDS,
  PRODUCT_SORT_OPTIONS,
} from './product.constants';
import {
  Product,
  ProductDocument,
  ProductStatus,
} from './schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    private readonly inventoryService: InventoryService,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private readonly eventEmitter: EventEmitter2,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const slug = generateSlug(createProductDto.title);
      const existing = await this.productModel
        .findOne({ slug })
        .session(session);
      if (existing) {
        throw new ConflictException('Product with this title already exists');
      }

      // Fetch category and brand names for SKU generation
      const category = await this.categoryService.findOne(
        createProductDto.categoryId,
      );
      const brand = createProductDto.brandId
        ? await this.brandService.findOne(createProductDto.brandId)
        : null;

      const sku =
        createProductDto.sku ||
        generateSKU(brand?.name || 'GEN', category.name);

      const barcode =
        createProductDto.barcode === undefined ||
        createProductDto.barcode === null ||
        (typeof createProductDto.barcode === 'string' &&
          createProductDto.barcode.trim() === '')
          ? undefined
          : createProductDto.barcode.trim();

      const cleanMedia = (createProductDto.media || []).filter(
        (m) => m && typeof m.url === 'string' && m.url.trim() !== '',
      );

      const product = new this.productModel({
        ...createProductDto,
        media: cleanMedia,
        slug,
        sku,
        barcode,
        stock: createProductDto.stock || 0,
        isInStock: (createProductDto.stock || 0) > 0,
      });

      const savedProduct = await product.save({ session });

      await this.inventoryService.create(
        {
          productId: (savedProduct._id as Types.ObjectId).toString(),
          sku: savedProduct.sku,
          stockQuantity: createProductDto.stock || 0,
          lowStockThreshold: 5,
          variantStock:
            createProductDto.variants?.map((v) => ({
              variantSku:
                v.sku ||
                `${savedProduct.sku}-${v.name.substring(0, 3).toUpperCase()}`,
              stockQuantity: 0,
            })) || [],
        },
        session,
      );
      await session.commitTransaction();

      this.emitMediaEvents(savedProduct, 'attach');

      return savedProduct;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async findAllPublic(queryDto: ProductQueryDto) {
    const paginateQueries = pick(
      queryDto,
      paginateOptions as unknown as (keyof ProductQueryDto)[],
    );
    const filterQuery = this.buildProductFilter(queryDto, true);

    const pagination = paginationHelpers.calculatePagination(
      paginateQueries as any,
    );
    // Public safety cap: Maximum 30 products per page
    if (pagination.limit > 30) {
      pagination.limit = 30;
      pagination.skip = (pagination.page - 1) * pagination.limit;
    }
    this.applySorting(pagination);

    const result = await getPaginatedData<ProductDocument>({
      model: this.productModel,
      paginationQuery: pagination,
      filterQuery,
      populate: ['categoryId', 'brandId', 'subCategoryIds'],
    });

    result.data = result.data.map((item: any) => {
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

  async findAllAdmin(queryDto: ProductQueryDto) {
    const paginateQueries = pick(
      queryDto,
      paginateOptions as unknown as (keyof ProductQueryDto)[],
    );
    const filterQuery = this.buildProductFilter(queryDto, false);

    const pagination = paginationHelpers.calculatePagination(
      paginateQueries as any,
    );
    this.applySorting(pagination);

    return await getPaginatedData<ProductDocument>({
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

  async findOnePublic(idOrSlug: string): Promise<ProductDocument> {
    const query = Types.ObjectId.isValid(idOrSlug)
      ? { _id: new Types.ObjectId(idOrSlug) }
      : { slug: idOrSlug };

    const product = await this.productModel
      .findOne({
        ...query,
        isDeleted: false,
        status: ProductStatus.ACTIVE,
      })
      .select('-vendorId -isDeleted -deletedAt -lastStockSyncAt -__v')
      .populate(['categoryId', 'brandId', 'subCategoryIds']);

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findOneAdmin(id: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findOne({
        _id: new Types.ObjectId(id),
      })
      .populate(['categoryId', 'brandId', 'subCategoryIds']);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    const oldProduct = await this.findOneAdmin(id);
    const updateData: any = {
      ...updateProductDto,
    };

    if (updateProductDto.media) {
      updateData.media = updateProductDto.media.filter(
        (m) => m && typeof m.url === 'string' && m.url.trim() !== '',
      );
    }

    if (updateProductDto.title) {
      updateData.slug = generateSlug(updateProductDto.title);
    }

    const updateQuery: any = {};
    const unsetQuery: any = {};

    if (
      updateProductDto.barcode === null ||
      (typeof updateProductDto.barcode === 'string' &&
        updateProductDto.barcode.trim() === '')
    ) {
      delete updateData.barcode;
      unsetQuery.barcode = '';
    } else if (updateProductDto.barcode !== undefined) {
      updateData.barcode = updateProductDto.barcode.trim();
    }

    if (Object.keys(updateData).length > 0) {
      updateQuery.$set = updateData;
    }
    if (Object.keys(unsetQuery).length > 0) {
      updateQuery.$unset = unsetQuery;
    }

    const product = await this.productModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateQuery,
      { new: true },
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (
      updateProductDto.thumbnail &&
      updateProductDto.thumbnail !== oldProduct.thumbnail
    ) {
      this.emitMediaEvents(oldProduct, 'detach', true);
      this.emitMediaEvents(product, 'attach', true);
    }

    if (updateProductDto.media) {
      const oldMediaUrls = new Set((oldProduct.media || []).map((m) => m.url));
      const newMediaUrls = new Set((product.media || []).map((m) => m.url));

      (oldProduct.media || []).forEach((m) => {
        if (!newMediaUrls.has(m.url)) {
          const mediaId = extractMediaIdFromUrl(m.url);
          if (mediaId) {
            this.eventEmitter.emit(
              MediaEvent.IMAGE_DETACHED,
              new ImageDetachedEvent(mediaId),
            );
          }
        }
      });

      (product.media || []).forEach((m) => {
        if (!oldMediaUrls.has(m.url)) {
          const mediaId = extractMediaIdFromUrl(m.url);
          if (mediaId) {
            this.eventEmitter.emit(
              MediaEvent.IMAGE_ATTACHED,
              new ImageAttachedEvent(
                mediaId,
                (product._id as Types.ObjectId).toString(),
                'product',
              ),
            );
          }
        }
      });
    }

    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.updateOne(
      { _id: new Types.ObjectId(id) },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          status: ProductStatus.ARCHIVED,
        },
      },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException('Product not found');
    }
  }

  async hardDelete(id: string): Promise<void> {
    const product = await this.findOneAdmin(id);
    const result = await this.productModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Product not found');
    }

    this.emitMediaEvents(product, 'detach');
  }

  async updateStatus(
    id: string,
    status: ProductStatus,
  ): Promise<ProductDocument> {
    const product = await this.productModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { $set: { status } },
      { new: true },
    );
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async restore(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), isDeleted: true },
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
          status: ProductStatus.DRAFT,
        },
      },
      { new: true },
    );

    if (!product) {
      throw new NotFoundException('Product not found or not deleted');
    }
    return product;
  }

  async bulkUpdateStatus(ids: string[], status: ProductStatus): Promise<any> {
    return this.productModel.updateMany(
      { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } },
      { $set: { status } },
    );
  }

  async updateStock(productId: string, quantityChange: number): Promise<void> {
    await this.inventoryService.adjustStock(productId, {
      quantity: quantityChange,
      type:
        quantityChange > 0
          ? InventoryTransactionType.RESTOCK
          : InventoryTransactionType.SALE,
      reason: 'Manual adjustment via Product Service',
    });
  }

  async findByIds(ids: string[]): Promise<ProductDocument[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    // Safety cap: Maximum 30 IDs per request for public lookup
    const safeIds = ids.slice(0, 30);
    const objectIds = safeIds
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    const products = await this.productModel
      .find({
        _id: { $in: objectIds },
        isDeleted: false,
      })
      .select('-vendorId -isDeleted -deletedAt -lastStockSyncAt -__v')
      .populate(['categoryId', 'brandId', 'subCategoryIds'])
      .exec();

    const productMap = new Map(
      products.map((product) => [
        (product._id as Types.ObjectId).toString(),
        product,
      ]),
    );
    const result: ProductDocument[] = [];
    for (const id of safeIds) {
      const found = productMap.get(id);
      if (found) {
        result.push(found);
      }
    }
    return result;
  }

  // --- Private Helpers ---

  private buildProductFilter(
    query: ProductQueryDto,
    isPublic = true,
  ): FilterQuery<ProductDocument> {
    const filter: FilterQuery<ProductDocument> = {};

    if (isPublic) {
      filter.isDeleted = false;
      filter.status = query.status
        ? (query.status as ProductStatus)
        : ProductStatus.ACTIVE;
    } else {
      if (query.status) {
        filter.status = query.status as ProductStatus;
      }
    }

    if (query.vendorId && Types.ObjectId.isValid(query.vendorId)) {
      filter.vendorId = new Types.ObjectId(query.vendorId);
    }

    const normalizeToArray = (val: any): string[] => {
      if (!val) return [];
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

    // 1. Brand Filter (brandId / brand) - supports single, comma-separated, or array of IDs
    const brandRaw = query.brandId || query.brand;
    const brandVals = normalizeToArray(brandRaw);
    if (brandVals.length > 0) {
      const objectIds = brandVals
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id));
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

    // 2. Category Filter (categoryId / category) - supports single, comma-separated, or array of IDs
    const catRaw = query.categoryId || query.category;
    const catVals = normalizeToArray(catRaw);
    if (catVals.length > 0) {
      const objectIds = catVals
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id));
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

    // 3. Search Filter (searchTerm)
    if (query.searchTerm && query.searchTerm.trim()) {
      const term = query.searchTerm.trim();
      const regex = new RegExp(term, 'i');
      const searchConditions: any[] = [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { tags: { $in: [regex] } },
        { keywords: { $in: [regex] } },
      ];
      if (Types.ObjectId.isValid(term)) {
        searchConditions.push({ _id: new Types.ObjectId(term) });
      }
      filter.$and = filter.$and || [];
      filter.$and.push({ $or: searchConditions });
    }

    // 4. Price Range Filter (minPrice, maxPrice)
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceCond: Record<string, number> = {};
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

    // 5. Boolean Flags
    if (typeof query.isOnOffer === 'boolean') filter.isOnOffer = query.isOnOffer;
    if (typeof query.isBestSeller === 'boolean') filter.isBestSeller = query.isBestSeller;
    if (typeof query.isFeatured === 'boolean') filter.isFeatured = query.isFeatured;
    if (typeof query.isNew === 'boolean') filter.isNew = query.isNew;
    if (typeof query.isPerishable === 'boolean') filter.isPerishable = query.isPerishable;

    return filter;
  }

  private applySorting(pagination: any) {
    if (pagination.sortBy && (PRODUCT_SORT_OPTIONS as any)[pagination.sortBy]) {
      const sortOption = (PRODUCT_SORT_OPTIONS as any)[pagination.sortBy];
      const field = Object.keys(sortOption)[0];
      pagination.sortBy = field;
      pagination.sortOrder = sortOption[field];
    } else if (pagination.sortBy === 'price') {
      pagination.sortBy = 'price.discountPrice';
    }
  }

  private emitMediaEvents(
    product: ProductDocument,
    type: 'attach' | 'detach',
    thumbnailOnly = false,
  ) {
    const productId = (product._id as Types.ObjectId).toString();
    const thumbnailId = extractMediaIdFromUrl(product.thumbnail);

    if (thumbnailId) {
      this.eventEmitter.emit(
        type === 'attach'
          ? MediaEvent.IMAGE_ATTACHED
          : MediaEvent.IMAGE_DETACHED,
        type === 'attach'
          ? new ImageAttachedEvent(thumbnailId, productId, 'product')
          : new ImageDetachedEvent(thumbnailId),
      );
    }

    if (!thumbnailOnly && product.media && product.media.length > 0) {
      product.media.forEach((m) => {
        const mediaId = extractMediaIdFromUrl(m.url);
        if (mediaId) {
          this.eventEmitter.emit(
            type === 'attach'
              ? MediaEvent.IMAGE_ATTACHED
              : MediaEvent.IMAGE_DETACHED,
            type === 'attach'
              ? new ImageAttachedEvent(mediaId, productId, 'product')
              : new ImageDetachedEvent(mediaId),
          );
        }
      });
    }
  }
}
