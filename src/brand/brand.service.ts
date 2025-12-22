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
import { BrandQueryOptionsDto } from './dto/brand-query-options.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand, BrandDocument } from './schemas/brand.schema';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<BrandDocument> {
    const slug = createSlug(createBrandDto.name);

    const existingBrand = await this.brandModel.findOne({
      $or: [{ name: createBrandDto.name }, { slug }],
    });

    if (existingBrand) {
      throw new ConflictException(
        'Brand with this name or slug already exists',
      );
    }

    return this.brandModel.create({
      ...createBrandDto,
      slug,
    });
  }

  async findAll(query: BrandQueryOptionsDto) {
    const paginateQueries = pick(query, paginateOptions);
    const filterQuery: any = pick(query, ['searchTerm', 'isActive']);

    if (filterQuery.searchTerm) {
      filterQuery.$text = { $search: filterQuery.searchTerm };
      delete filterQuery.searchTerm;
    }

    const pagination = paginationHelpers.calculatePagination(paginateQueries);

    return await getPaginatedData<BrandDocument>({
      model: this.brandModel,
      paginationQuery: pagination,
      filterQuery,
    });
  }

  async findOne(id: string): Promise<BrandDocument> {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return brand;
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<BrandDocument> {
    const updateData: any = { ...updateBrandDto };

    if (updateBrandDto.name) {
      const slug = createSlug(updateBrandDto.name);

      const existingBrand = await this.brandModel.findOne({
        $or: [{ name: updateBrandDto.name }, { slug }],
        _id: { $ne: id },
      });

      if (existingBrand) {
        throw new ConflictException(
          'Brand with this name or slug already exists',
        );
      }

      updateData.slug = slug;
    }

    const updatedBrand = await this.brandModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedBrand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return updatedBrand;
  }

  async remove(id: string): Promise<BrandDocument> {
    const result = await this.brandModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return result;
  }
}
