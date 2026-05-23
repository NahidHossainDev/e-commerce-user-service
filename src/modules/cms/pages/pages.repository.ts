import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { IPaginatedResponse } from 'src/common/interface';
import { paginationHelpers } from 'src/utils/helpers';
import { getPaginatedData } from 'src/utils/mongodb/getPaginatedData';
import { CreateCmsPageDto, QueryCmsPageDto, UpdateCmsPageDto } from './dto/page.dto';
import { CmsPage, CmsPageDocument } from './schemas/page.schema';

@Injectable()
export class CmsPagesRepository {
  constructor(
    @InjectModel(CmsPage.name)
    private readonly pageModel: Model<CmsPageDocument>,
  ) {}

  async create(dto: CreateCmsPageDto, session?: ClientSession): Promise<CmsPageDocument> {
    const page = new this.pageModel(dto);
    return await page.save({ session });
  }

  async findById(id: string): Promise<CmsPageDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return await this.pageModel.findById(new Types.ObjectId(id)).exec();
  }

  async findBySlug(slug: string): Promise<CmsPageDocument | null> {
    return await this.pageModel.findOne({ slug: slug.toLowerCase() }).exec();
  }

  async findHomePage(): Promise<CmsPageDocument | null> {
    return await this.pageModel.findOne({ isHomePage: true }).exec();
  }

  async update(
    id: string,
    dto: UpdateCmsPageDto & { componentIds?: Types.ObjectId[] },
    session?: ClientSession,
  ): Promise<CmsPageDocument> {
    const updated = await this.pageModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        { $set: dto },
        { new: true, session },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(`CMS Page with ID ${id} not found`);
    }

    return updated;
  }

  async delete(id: string, session?: ClientSession): Promise<CmsPageDocument> {
    const deleted = await this.pageModel
      .findOneAndDelete({ _id: new Types.ObjectId(id) }, { session })
      .exec();

    if (!deleted) {
      throw new NotFoundException(`CMS Page with ID ${id} not found`);
    }

    return deleted;
  }

  async findAll(queryDto: QueryCmsPageDto): Promise<IPaginatedResponse<CmsPageDocument>> {
    const pagination = paginationHelpers.calculatePagination({
      page: queryDto.page,
      limit: queryDto.limit,
      sortBy: queryDto.sortBy || 'createdAt',
      sortOrder: queryDto.sortOrder || 'desc',
    });

    const filterQuery: FilterQuery<CmsPageDocument> = {};

    if (queryDto.status) {
      filterQuery.status = queryDto.status;
    }
    if (queryDto.type) {
      filterQuery.type = queryDto.type;
    }
    if (queryDto.searchTerm) {
      filterQuery.$or = [
        { title: { $regex: queryDto.searchTerm, $options: 'i' } },
        { slug: { $regex: queryDto.searchTerm, $options: 'i' } },
      ];
    }

    return await getPaginatedData<CmsPageDocument>({
      model: this.pageModel,
      paginationQuery: pagination,
      filterQuery,
    });
  }

  async unsetHomePage(exceptId: string, session?: ClientSession): Promise<void> {
    await this.pageModel
      .updateMany(
        { _id: { $ne: new Types.ObjectId(exceptId) }, isHomePage: true },
        { $set: { isHomePage: false } },
        { session },
      )
      .exec();
  }
}
