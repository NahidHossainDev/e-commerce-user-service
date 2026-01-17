import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
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

      const sku =
        createProductDto.sku ||
        generateSKU(
          createProductDto.brand?.name || 'GEN',
          createProductDto.category.name,
        );

      const product = new this.productModel({
        ...createProductDto,
        slug,
        sku,
        stock: createProductDto.initialStock || 0,
        isInStock: (createProductDto.initialStock || 0) > 0,
      });

      const savedProduct = await product.save({ session });

      await this.inventoryService.create(
        {
          productId: (savedProduct._id as Types.ObjectId).toString(),
          sku: savedProduct.sku,
          stockQuantity: createProductDto.initialStock || 0,
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
      .select('-vendorId -isDeleted -deletedAt -lastStockSyncAt -__v');

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findOneAdmin(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findOne({
      _id: new Types.ObjectId(id),
    });
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
    const updateData: UpdateProductDto & { slug?: string } = {
      ...updateProductDto,
    };

    if (updateProductDto.title) {
      updateData.slug = generateSlug(updateProductDto.title);
    }

    const product = await this.productModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { $set: updateData as UpdateQuery<ProductDocument> },
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

    return product;
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOneAdmin(id);
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

    this.emitMediaEvents(product, 'detach');
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

  // --- Private Helpers ---

  private applySearchFilters(filterQuery: any, searchTerm?: string) {
    if (searchTerm) {
      filterQuery['$or'] = PRODUCT_SEARCH_FIELDS.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      }));
    }
  }

  private applyIdFilters(
    filterQuery: any,
    categoryId?: string,
    brandId?: string,
  ) {
    if (categoryId) filterQuery['category.id'] = new Types.ObjectId(categoryId);
    if (brandId) filterQuery['brand.id'] = new Types.ObjectId(brandId);
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
