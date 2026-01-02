import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginateOptions } from 'src/common/constants';
import { createSlug, paginationHelpers, pick } from 'src/utils/helpers';
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

    if (createCategoryDto.parentCategory) {
      const parent = await this.categoryModel.findById(
        createCategoryDto.parentCategory,
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

    return this.categoryModel.create({
      ...createCategoryDto,
      slug,
      level,
      path,
    });
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

    if (updateCategoryDto.parentCategory !== undefined) {
      let newLevel = 0;
      let newPath = ',';

      if (updateCategoryDto.parentCategory) {
        if (updateCategoryDto.parentCategory === id) {
          throw new ConflictException('Category cannot be its own parent');
        }

        const parent = await this.categoryModel.findById(
          updateCategoryDto.parentCategory,
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
        category.parentCategory?.toString() !== updateCategoryDto.parentCategory
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

    return updatedCategory;
  }

  async remove(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check if category has children
    const childCount = await this.categoryModel.countDocuments({
      parentCategory: id,
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
      .exec();

    return buildCategoryTree(categories);
  }

  async getBySlug(slug: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findOne({ slug }).exec();
    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }
    return category;
  }
}
