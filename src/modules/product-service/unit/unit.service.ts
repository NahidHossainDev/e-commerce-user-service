import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { paginateOptions } from 'src/common/constants';
import { paginationHelpers, pick } from 'src/utils/helpers';
import { getPaginatedData } from 'src/utils/mongodb/getPaginatedData';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UnitQueryOptions } from './dto/unit-query-options.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit, UnitDocument } from './schemas/unit.schema';

@Injectable()
export class UnitService {
  constructor(@InjectModel(Unit.name) private unitModel: Model<UnitDocument>) {}

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const createdUnit = new this.unitModel(createUnitDto);
    return await createdUnit.save();
  }

  async findAll(query: UnitQueryOptions) {
    const paginateQueries = pick(query, paginateOptions);
    const filters = pick(query, ['searchTerm', 'category']);

    const pagination = paginationHelpers.calculatePagination(paginateQueries);

    const { searchTerm, ...filterData } = filters;
    const andConditions: FilterQuery<UnitDocument>[] = [];

    if (searchTerm) {
      andConditions.push({
        $or: ['name', 'symbol'].map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      });
    }

    if (Object.keys(filterData).length) {
      andConditions.push({
        $and: Object.entries(filterData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }

    const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {};

    return await getPaginatedData<UnitDocument>({
      model: this.unitModel,
      paginationQuery: pagination,
      filterQuery: whereConditions,
    });
  }

  async findOne(id: string): Promise<Unit> {
    const unit = await this.unitModel.findById(id).exec();
    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }
    return unit;
  }

  async update(id: string, updateUnitDto: UpdateUnitDto): Promise<Unit> {
    const updatedUnit = await this.unitModel
      .findByIdAndUpdate(id, updateUnitDto, { new: true })
      .exec();

    if (!updatedUnit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }
    return updatedUnit;
  }

  async remove(id: string): Promise<Unit> {
    const deletedUnit = await this.unitModel.findByIdAndDelete(id).exec();
    if (!deletedUnit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }
    return deletedUnit;
  }
}
