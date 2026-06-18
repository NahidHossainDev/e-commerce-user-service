import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { paginateOptions } from 'src/common/constants';
import {
  ImageAttachedEvent,
  ImageDetachedEvent,
  MediaEvent,
} from 'src/common/events/media.events';
import { createSlug, paginationHelpers, pick } from 'src/utils/helpers';
import { extractMediaIdFromUrl } from 'src/utils/helpers/media-helper';
import { getPaginatedData } from 'src/utils/mongodb/getPaginatedData';
import {
  categoryFilterableFields,
  categorySearchableFields,
} from './category.constants';
import { buildCategoryTree } from './category.utils';
import { CategoryQueryOptionsDto } from './dto/category-query-options.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDocument> {
    const slug = createSlug(createCategoryDto.name);

    const existingCategory = await this.categoryModel.findOne({
      $or: [{ name: createCategoryDto.name }, { slug }],
    });

    if (existingCategory) {
      throw new ConflictException(
        'Category with this name or slug already exists',
      );
    }

    let level = 0;
    let path = ',';

    if (createCategoryDto.parentCategoryId) {
      const parent = await this.categoryModel.findById(
        createCategoryDto.parentCategoryId,
      );
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
      level = parent.level + 1;
      path = `${parent.path}${parent._id.toString()},`;

      if (level > 3) {
        throw new ConflictException('Category depth cannot exceed 3 levels');
      }
    }

    // Auto-generate sortOrder if not provided
    let sortOrder = createCategoryDto.sortOrder;
    if (sortOrder === undefined || sortOrder === null) {
      sortOrder = await this.generateNextSortOrder(
        createCategoryDto.parentCategoryId,
      );
    } else {
      // Validate sortOrder uniqueness
      await this.validateSortOrderUniqueness(
        createCategoryDto.parentCategoryId,
        sortOrder,
      );
    }

    const savedCategory = await this.categoryModel.create({
      ...createCategoryDto,
      slug,
      level,
      path,
      sortOrder,
    });

    if (savedCategory.image) {
      const mediaId = extractMediaIdFromUrl(savedCategory.image);
      if (mediaId) {
        this.eventEmitter.emit(
          MediaEvent.IMAGE_ATTACHED,
          new ImageAttachedEvent(
            mediaId,
            savedCategory._id.toString(),
            'category',
          ),
        );
      }
    }

    return savedCategory;
  }

  private async generateNextSortOrder(
    parentCategoryId?: string,
  ): Promise<number> {
    const maxSortOrder = await this.categoryModel
      .find({ parentCategoryId: parentCategoryId || null })
      .sort({ sortOrder: -1 })
      .limit(1)
      .select('sortOrder')
      .exec();

    return maxSortOrder.length > 0 ? maxSortOrder[0].sortOrder + 1 : 0;
  }

  private async validateSortOrderUniqueness(
    parentCategoryId: string | undefined,
    sortOrder: number,
    excludeId?: string,
  ): Promise<void> {
    const existingCategory = await this.categoryModel.findOne({
      parentCategoryId: parentCategoryId || null,
      sortOrder,
      ...(excludeId && { _id: { $ne: excludeId } }),
    });

    if (existingCategory) {
      throw new ConflictException(
        `Sort order ${sortOrder} is already taken for categories at this level`,
      );
    }
  }

  async findAll(query: CategoryQueryOptionsDto) {
    const paginateQueries = pick(query, paginateOptions);
    const filterQuery: any = pick(query, categoryFilterableFields);

    if (filterQuery.searchTerm) {
      filterQuery.$or = categorySearchableFields.map((field) => ({
        [field]: { $regex: filterQuery.searchTerm, $options: 'i' },
      }));
      delete filterQuery.searchTerm;
    }

    const pagination = paginationHelpers.calculatePagination(paginateQueries);

    return await getPaginatedData<CategoryDocument>({
      model: this.categoryModel,
      paginationQuery: pagination,
      filterQuery,
    });
  }

  async findOne(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const updateData: any = { ...updateCategoryDto };

    if (updateCategoryDto.name) {
      const slug = createSlug(updateCategoryDto.name);
      const existingCategory = await this.categoryModel.findOne({
        $or: [{ name: updateCategoryDto.name }, { slug }],
        _id: { $ne: id },
      });

      if (existingCategory) {
        throw new ConflictException(
          'Category with this name or slug already exists',
        );
      }
      updateData.slug = slug;
    }

    if (updateCategoryDto.sortOrder !== undefined) {
      updateData.sortOrder = updateCategoryDto.sortOrder;
    }

    // Handle sortOrder validation and auto-generation
    const targetParentId =
      updateCategoryDto.parentCategoryId !== undefined
        ? updateCategoryDto.parentCategoryId
        : category.parentCategoryId?.toString();

    if (updateCategoryDto.sortOrder !== undefined) {
      // Validate sortOrder uniqueness
      await this.validateSortOrderUniqueness(
        targetParentId,
        updateCategoryDto.sortOrder,
        id,
      );
    } else if (
      updateCategoryDto.parentCategoryId !== undefined &&
      updateCategoryDto.parentCategoryId !==
        category.parentCategoryId?.toString()
    ) {
      // Parent changed, auto-generate new sortOrder for the new level
      updateData.sortOrder = await this.generateNextSortOrder(
        updateCategoryDto.parentCategoryId,
      );
    }

    if (updateCategoryDto.parentCategoryId !== undefined) {
      let newLevel = 0;
      let newPath = ',';

      if (updateCategoryDto.parentCategoryId) {
        if (updateCategoryDto.parentCategoryId === id) {
          throw new ConflictException('Category cannot be its own parent');
        }

        const parent = await this.categoryModel.findById(
          updateCategoryDto.parentCategoryId,
        );
        if (!parent) {
          throw new NotFoundException('Parent category not found');
        }

        if (parent.path.includes(`,${id},`)) {
          throw new ConflictException(
            'Cannot move category to one of its descendants',
          );
        }

        newLevel = parent.level + 1;
        newPath = `${parent.path}${parent._id.toString()},`;

        if (newLevel > 3) {
          throw new ConflictException('Category depth cannot exceed 3 levels');
        }
      }

      // If category parent or hierarchy changed, update children too
      if (
        category.parentCategoryId?.toString() !==
        updateCategoryDto.parentCategoryId
      ) {
        const oldPath = `${category.path}${category._id.toString()},`;
        const nextPath = `${newPath}${category._id.toString()},`;

        // Update current category and all descendants
        await this.categoryModel.updateMany(
          { path: { $regex: `^${oldPath}` } },
          [
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
          ],
        );

        updateData.level = newLevel;
        updateData.path = newPath;
      }
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // --- Media Events ---
    if (updateCategoryDto.image && updateCategoryDto.image !== category.image) {
      const oldId = extractMediaIdFromUrl(category.image);
      const newId = extractMediaIdFromUrl(updateCategoryDto.image);
      const categoryId = updatedCategory._id.toString();

      if (oldId) {
        this.eventEmitter.emit(
          MediaEvent.IMAGE_DETACHED,
          new ImageDetachedEvent(oldId),
        );
      }
      if (newId) {
        this.eventEmitter.emit(
          MediaEvent.IMAGE_ATTACHED,
          new ImageAttachedEvent(newId, categoryId, 'category'),
        );
      }
    }

    return updatedCategory;
  }

  async remove(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check if category has children
    const childCount = await this.categoryModel.countDocuments({
      parentCategoryId: id,
    });
    if (childCount > 0) {
      throw new ConflictException('Cannot delete category with sub-categories');
    }

    const deletedCategory = await this.categoryModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (deletedCategory.image) {
      const mediaId = extractMediaIdFromUrl(deletedCategory.image);
      if (mediaId) {
        this.eventEmitter.emit(
          MediaEvent.IMAGE_DETACHED,
          new ImageDetachedEvent(mediaId),
        );
      }
    }

    return deletedCategory;
  }

  async findAllPublic(): Promise<CategoryDocument[]> {
    return this.categoryModel
      .find({ isActive: true })
      .sort({ sortOrder: 1 })
      .exec();
  }

  async getPublicCategoryTree(): Promise<Category[]> {
    const categories = await this.categoryModel
      .find({ isActive: true })
      .sort({ sortOrder: 1 })
      .lean()
      .exec();

    return buildCategoryTree(categories as any);
  }

  async getBySlug(slug: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findOne({ slug }).exec();
    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }
    return category;
  }

  async getParentCategories(): Promise<Category[]> {
    const allCategories = await this.categoryModel
      .find({ isActive: true, level: 0 })
      .sort({ sortOrder: 1 })
      .lean()
      .exec();

    return buildCategoryTree(allCategories as any);
  }

  async getSubCategories(parentId: string): Promise<Category[]> {
    const parentCategory = await this.categoryModel.findById(parentId).exec();
    if (!parentCategory) {
      throw new NotFoundException(
        `Parent category with id ${parentId} not found`,
      );
    }

    // Get all categories that have this parent in their path (including the parent)
    const subCategories = await this.categoryModel
      .find({
        isActive: true,
        path: { $regex: `,${parentId},` },
      })
      .sort({ sortOrder: 1 })
      .lean()
      .exec();

    const fullTree = buildCategoryTree(subCategories as any);
    // Return the direct children of the parent (not the parent itself)
    return fullTree.filter(
      (cat) => cat.parentCategoryId?.toString() === parentId,
    );
  }

  async getParentCategoriesAdmin(): Promise<Category[]> {
    const allCategories = await this.categoryModel
      .find({})
      .sort({ sortOrder: 1 })
      .lean()
      .exec();

    const fullTree = buildCategoryTree(allCategories as any);
    return fullTree.filter((cat) => cat.level === 0);
  }

  async getSubCategoriesAdmin(parentId: string): Promise<Category[]> {
    const parentCategory = await this.categoryModel.findById(parentId).exec();
    if (!parentCategory) {
      throw new NotFoundException(
        `Parent category with id ${parentId} not found`,
      );
    }

    // Get all categories that have this parent in their path (including the parent)
    const subCategories = await this.categoryModel
      .find({
        path: { $regex: `,${parentId},` },
      })
      .sort({ sortOrder: 1 })
      .lean()
      .exec();

    const fullTree = buildCategoryTree(subCategories as any);
    // Return the direct children of the parent (not the parent itself)
    return fullTree.filter(
      (cat) => cat.parentCategoryId?.toString() === parentId,
    );
  }

  async findByIds(ids: string[]): Promise<CategoryDocument[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    const objectIds = ids
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    const categories = await this.categoryModel
      .find({ _id: { $in: objectIds }, isActive: true })
      .exec();

    // Return the categories in the order of the requested ids
    const categoryMap = new Map(
      categories.map((cat) => [cat._id.toString(), cat]),
    );
    const result: CategoryDocument[] = [];
    for (const id of ids) {
      const found = categoryMap.get(id);
      if (found) {
        result.push(found);
      }
    }
    return result;
  }
}
