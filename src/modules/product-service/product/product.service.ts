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
    const filters = pick(queryDto, PRODUCT_FILTER_FIELDS);

    const {
      searchTerm,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      ...remainingFilters
    } = filters;

    const filterQuery: FilterQuery<ProductDocument> = {
      isDeleted: false,
      status: ProductStatus.ACTIVE,
      ...remainingFilters,
    };

    this.applySearchFilters(filterQuery, searchTerm);
    this.applyIdFilters(filterQuery, categoryId, brandId);
    this.applyPriceFilters(filterQuery, minPrice, maxPrice);

    const pagination = paginationHelpers.calculatePagination(
      paginateQueries as any, // Cast to avoid strict type error vs helper signature
    );
    this.applySorting(pagination);

    const result = await getPaginatedData<ProductDocument>({
      model: this.productModel,
      paginationQuery: pagination,
      filterQuery,
      populate: ['categoryId', 'brandId', 'subCategoryIds'],
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

  async findAllAdmin(queryDto: ProductQueryDto) {
    const paginateQueries = pick(
      queryDto,
      paginateOptions as unknown as (keyof ProductQueryDto)[],
    );
    const filters = pick(queryDto, PRODUCT_FILTER_FIELDS);

    const {
      searchTerm,
      categoryId,
      brandId,
      vendorId,
      minPrice,
      maxPrice,
      ...remainingFilters
    } = filters;

    const filterQuery: FilterQuery<ProductDocument> = {
      ...remainingFilters,
    };

    if (vendorId) filterQuery.vendorId = new Types.ObjectId(vendorId);

    this.applySearchFilters(filterQuery, searchTerm);
    this.applyIdFilters(filterQuery, categoryId, brandId);
    this.applyPriceFilters(filterQuery, minPrice, maxPrice);

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
    const objectIds = ids
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
    for (const id of ids) {
      const found = productMap.get(id);
      if (found) {
        result.push(found);
      }
    }
    return result;
  }

  // --- Private Helpers ---

  private applySearchFilters(filterQuery: any, searchTerm?: string) {
    if (!searchTerm) return;

    if (Types.ObjectId.isValid(searchTerm)) {
      filterQuery._id = new Types.ObjectId(searchTerm);
      return;
    }

    filterQuery['$or'] = PRODUCT_SEARCH_FIELDS.filter(
      (field) => field !== '_id',
    ).map((field) => ({ [field]: { $regex: searchTerm, $options: 'i' } }));
  }

  private applyIdFilters(
    filterQuery: any,
    categoryId?: string,
    brandId?: string,
  ) {
    if (categoryId) filterQuery.categoryId = new Types.ObjectId(categoryId);
    if (brandId) filterQuery.brandId = new Types.ObjectId(brandId);
  }

  private applyPriceFilters(
    filterQuery: any,
    minPrice?: number,
    maxPrice?: number,
  ) {
    if (minPrice !== undefined || maxPrice !== undefined) {
      filterQuery['price.basePrice'] = {
        ...(minPrice !== undefined && { $gte: minPrice }),
        ...(maxPrice !== undefined && { $lte: maxPrice }),
      };
    }
  }

  private applySorting(pagination: any) {
    if (pagination.sortBy && (PRODUCT_SORT_OPTIONS as any)[pagination.sortBy]) {
      const sortOption = (PRODUCT_SORT_OPTIONS as any)[pagination.sortBy];
      const field = Object.keys(sortOption)[0];
      pagination.sortBy = field;
      pagination.sortOrder = sortOption[field];
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
