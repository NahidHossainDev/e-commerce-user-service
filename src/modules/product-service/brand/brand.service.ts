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
import { BrandQueryOptionsDto } from './dto/brand-query-options.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand, BrandDocument } from './schemas/brand.schema';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
    private readonly eventEmitter: EventEmitter2,
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

    const savedBrand = await this.brandModel.create({
      ...createBrandDto,
      slug,
    });

    if (savedBrand.logo) {
      const mediaId = extractMediaIdFromUrl(savedBrand.logo);
      if (mediaId) {
        this.eventEmitter.emit(
          MediaEvent.IMAGE_ATTACHED,
          new ImageAttachedEvent(
            mediaId,
            (savedBrand._id as Types.ObjectId).toString(),
            'brand',
          ),
        );
      }
    }

    return savedBrand;
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

    const oldBrand = await this.brandModel.findById(id);
    if (!oldBrand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    const updatedBrand = await this.brandModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedBrand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    // --- Media Events ---
    if (updateBrandDto.logo && updateBrandDto.logo !== oldBrand.logo) {
      const oldId = extractMediaIdFromUrl(oldBrand.logo);
      const newId = extractMediaIdFromUrl(updateBrandDto.logo);
      const brandId = (updatedBrand._id as Types.ObjectId).toString();

      if (oldId) {
        this.eventEmitter.emit(
          MediaEvent.IMAGE_DETACHED,
          new ImageDetachedEvent(oldId),
        );
      }
      if (newId) {
        this.eventEmitter.emit(
          MediaEvent.IMAGE_ATTACHED,
          new ImageAttachedEvent(newId, brandId, 'brand'),
        );
      }
    }

    return updatedBrand;
  }

  async remove(id: string): Promise<BrandDocument> {
    const brand = await this.brandModel.findById(id);
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    const result = await this.brandModel.findByIdAndDelete(id).exec();

    if (brand.logo) {
      const mediaId = extractMediaIdFromUrl(brand.logo);
      if (mediaId) {
        this.eventEmitter.emit(
          MediaEvent.IMAGE_DETACHED,
          new ImageDetachedEvent(mediaId),
        );
      }
    }

    return result as BrandDocument;
  }
}
