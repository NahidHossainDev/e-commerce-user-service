import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { paginateOptions } from '../../../common/constants';
import { paginationHelpers, pick } from '../../../utils/helpers';
import { getPaginatedData } from '../../../utils/mongodb/getPaginatedData';
import { generateSKU, generateSlug } from '../../../utils/product-helper';
import { InventoryService } from '../inventory/inventory.service';
import { InventoryTransactionType } from '../inventory/schemas/inventory-history.schema';
import { MediaService } from '../media/media.service';
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
    private readonly mediaService: MediaService,
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

      // Create dummy Media entry (can be updated later)
      await this.mediaService.create(
        {
          productId: (savedProduct._id as Types.ObjectId).toString(),
          primaryImage: createProductDto.thumbnail,
          images: [],
        },
        session,
      );

      await session.commitTransaction();
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
    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { isDeleted: true, deletedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException('Product not found');
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
