import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { InventoryService } from '../inventory/inventory.service';
import { MediaService } from '../media/media.service';
import { generateSKU, generateSlug } from '../utils/product-helper';
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from './dto/product.dto';
import { PRODUCT_FILTER_FIELDS, PRODUCT_SEARCH_FIELDS, PRODUCT_SORT_OPTIONS } from './product.constants';
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
      const existing = await this.productModel.findOne({ slug }).session(session);
      if (existing) {
        throw new ConflictException('Product with this title already exists');
      }

      const sku = createProductDto.sku || generateSKU(createProductDto.brand?.name || 'GEN', createProductDto.category.name);

      const product = new this.productModel({
        ...createProductDto,
        slug,
        sku,
        stock: createProductDto.initialStock || 0,
        isInStock: (createProductDto.initialStock || 0) > 0,
      });

      const savedProduct = await product.save({ session: session || null });

      // Create Inventory
      await this.inventoryService.create({
        productId: (savedProduct._id as Types.ObjectId).toString(),
        sku: savedProduct.sku,
        stockQuantity: createProductDto.initialStock || 0,
        lowStockThreshold: 5,
        variantStock: createProductDto.variants?.map(v => ({
          variantSku: v.sku || `${savedProduct.sku}-${v.name.substring(0, 3).toUpperCase()}`,
          stockQuantity: 0,
        })) || [],
      }, session);

      // Create dummy Media entry (can be updated later)
      await this.mediaService.create({
        productId: (savedProduct._id as Types.ObjectId).toString(),
        primaryImage: createProductDto.thumbnail,
        images: [],
      }); // Media service doesn't support session yet, but it's a separate collection.

      await session.commitTransaction();
      return savedProduct;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findAll(queryDto: ProductQueryDto) {
    const { 
      page = 1, 
      limit = 10, 
      sortBy, 
      sortOrder, 
      search, 
      minPrice, 
      maxPrice,
      ...filters 
    } = queryDto;

    const query: any = { isDeleted: false };

    // Apply Search
    if (search) {
      query.$or = PRODUCT_SEARCH_FIELDS.map(field => ({
        [field]: { $regex: search, $options: 'i' }
      }));
    }

    // Apply Filters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && PRODUCT_FILTER_FIELDS.includes(key)) {
        if (key === 'category.id' || key === 'brand.id' || key === 'vendorId') {
          query[key] = new Types.ObjectId(filters[key]);
        } else {
          query[key] = filters[key];
        }
      }
    });

    // Price Range Filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query['price.basePrice'] = {};
      if (minPrice !== undefined) query['price.basePrice'].$gte = minPrice;
      if (maxPrice !== undefined) query['price.basePrice'].$lte = maxPrice;
    }

    // Sorting
    let sort: any = { createdAt: -1 };
    if (sortBy && PRODUCT_SORT_OPTIONS[sortBy]) {
      sort = PRODUCT_SORT_OPTIONS[sortBy];
    } else if (sortBy) {
      sort = { [sortBy]: sortOrder || -1 };
    }

    const total = await this.productModel.countDocuments(query);
    const products = await this.productModel.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async findOne(idOrSlug: string): Promise<ProductDocument> {
    const query = Types.ObjectId.isValid(idOrSlug) 
      ? { _id: new Types.ObjectId(idOrSlug) } 
      : { slug: idOrSlug };

    const product = await this.productModel.findOne({ ...query, isDeleted: false });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDocument> {
    if (updateProductDto.title) {
       // Slug update is usually risky if it changes, maybe only for DRAFT products?
       // For now, let's allow it but be careful.
       (updateProductDto as any).slug = generateSlug(updateProductDto.title);
    }

    const product = await this.productModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), isDeleted: false },
      { $set: updateProductDto },
      { new: true }
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException('Product not found');
    }
  }

  async updateStock(productId: string, quantityChange: number): Promise<void> {
    const product = await this.productModel.findById(new Types.ObjectId(productId));
    if (!product) return;

    product.stock += quantityChange;
    product.isInStock = product.stock > 0;
    product.lastStockSyncAt = new Date();
    await product.save();
  }
}
