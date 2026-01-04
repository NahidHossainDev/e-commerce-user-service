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
import { Product, ProductDocument } from './schemas/product.schema';

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

      const savedProduct = await product.save({ session: session || null });

      // Create Inventory
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

      // --- Emit Media Events ---
      const productId = (savedProduct._id as Types.ObjectId).toString();
      const thumbnailId = extractMediaIdFromUrl(savedProduct.thumbnail);
      if (thumbnailId) {
        this.eventEmitter.emit(
          MediaEvent.IMAGE_ATTACHED,
          new ImageAttachedEvent(thumbnailId, productId, 'product'),
        );
      }
      // 2. Media Gallery (if any)
      if (savedProduct.media && savedProduct.media.length > 0) {
        savedProduct.media.forEach((m) => {
          const mediaId = extractMediaIdFromUrl(m.url);
          if (mediaId) {
            this.eventEmitter.emit(
              MediaEvent.IMAGE_ATTACHED,
              new ImageAttachedEvent(mediaId, productId, 'product'),
            );
          }
        });
      }

      return savedProduct;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async findAll(queryDto: ProductQueryDto) {
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
      isDeleted: false,
      ...remainingFilters,
    };

    // 1. Search Logic
    if (searchTerm) {
      filterQuery['$or'] = PRODUCT_SEARCH_FIELDS.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      }));
    }

    // 2. ID Mapping
    if (categoryId) filterQuery['category.id'] = new Types.ObjectId(categoryId);
    if (brandId) filterQuery['brand.id'] = new Types.ObjectId(brandId);
    if (vendorId) filterQuery.vendorId = new Types.ObjectId(vendorId);

    // 3. Price Range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filterQuery['price.basePrice'] = {
        ...(minPrice !== undefined && { $gte: minPrice }),
        ...(maxPrice !== undefined && { $lte: maxPrice }),
      };
    }

    const pagination = paginationHelpers.calculatePagination(
      paginateQueries as any,
    );

    // 4. Sort Mapping (Presets)
    if (pagination.sortBy && (PRODUCT_SORT_OPTIONS as any)[pagination.sortBy]) {
      const sortOption = (PRODUCT_SORT_OPTIONS as any)[pagination.sortBy];
      const field = Object.keys(sortOption)[0];
      pagination.sortBy = field;
      pagination.sortOrder = sortOption[field];
    }

    return await getPaginatedData<ProductDocument>({
      model: this.productModel,
      paginationQuery: pagination,
      filterQuery,
    });
  }

  async findOne(idOrSlug: string): Promise<ProductDocument> {
    const query = Types.ObjectId.isValid(idOrSlug)
      ? { _id: new Types.ObjectId(idOrSlug) }
      : { slug: idOrSlug };

    const product = await this.productModel.findOne({
      ...query,
      isDeleted: false,
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
    const oldProduct = await this.findOne(id);
    const updateData: UpdateProductDto & { slug?: string } = {
      ...updateProductDto,
    };

    if (updateProductDto.title) {
      updateData.slug = generateSlug(updateProductDto.title);
    }

    const product = await this.productModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), isDeleted: false },
      { $set: updateData as UpdateQuery<ProductDocument> },
      { new: true },
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // --- Media Events ---
    if (
      updateProductDto.thumbnail &&
      updateProductDto.thumbnail !== oldProduct.thumbnail
    ) {
      const oldId = extractMediaIdFromUrl(oldProduct.thumbnail);
      const newId = extractMediaIdFromUrl(updateProductDto.thumbnail);
      const productId = (product._id as Types.ObjectId).toString();

      if (oldId) {
        this.eventEmitter.emit(
          MediaEvent.IMAGE_DETACHED,
          new ImageDetachedEvent(oldId),
        );
      }
      if (newId) {
        this.eventEmitter.emit(
          MediaEvent.IMAGE_ATTACHED,
          new ImageAttachedEvent(newId, productId, 'product'),
        );
      }
    }

    return product;
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    const result = await this.productModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { isDeleted: true, deletedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException('Product not found');
    }

    // --- Media Events ---
    const thumbnailId = extractMediaIdFromUrl(product.thumbnail);
    if (thumbnailId) {
      this.eventEmitter.emit(
        MediaEvent.IMAGE_DETACHED,
        new ImageDetachedEvent(thumbnailId),
      );
    }
    if (product.media && product.media.length > 0) {
      product.media.forEach((m) => {
        const mediaId = extractMediaIdFromUrl(m.url);
        if (mediaId) {
          this.eventEmitter.emit(
            MediaEvent.IMAGE_DETACHED,
            new ImageDetachedEvent(mediaId),
          );
        }
      });
    }
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
}
