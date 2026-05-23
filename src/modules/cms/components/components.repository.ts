import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { CreateCmsComponentDto, UpdateCmsComponentDto } from './dto/component.dto';
import { CmsComponent, CmsComponentDocument } from './schemas/component.schema';

@Injectable()
export class CmsComponentsRepository {
  constructor(
    @InjectModel(CmsComponent.name)
    private readonly componentModel: Model<CmsComponentDocument>,
  ) {}

  async create(
    pageId: string,
    dto: CreateCmsComponentDto,
    session?: ClientSession,
  ): Promise<CmsComponentDocument> {
    const component = new this.componentModel({
      ...dto,
      pageId: new Types.ObjectId(pageId),
    });
    return await component.save({ session });
  }

  async findById(id: string): Promise<CmsComponentDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return await this.componentModel.findById(new Types.ObjectId(id)).exec();
  }

  async findByPageId(
    pageId: string,
    filterVisible = false,
  ): Promise<CmsComponentDocument[]> {
    const filter: any = { pageId: new Types.ObjectId(pageId) };
    if (filterVisible) {
      filter.isVisible = true;
    }
    return await this.componentModel
      .find(filter)
      .sort({ order: 1 })
      .lean()
      .exec() as unknown as CmsComponentDocument[];
  }

  async update(
    id: string,
    dto: UpdateCmsComponentDto,
    session?: ClientSession,
  ): Promise<CmsComponentDocument> {
    const updated = await this.componentModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id) },
        { $set: dto },
        { new: true, session },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(`CMS Component with ID ${id} not found`);
    }

    return updated;
  }

  async delete(id: string, session?: ClientSession): Promise<CmsComponentDocument> {
    const deleted = await this.componentModel
      .findOneAndDelete({ _id: new Types.ObjectId(id) }, { session })
      .exec();

    if (!deleted) {
      throw new NotFoundException(`CMS Component with ID ${id} not found`);
    }

    return deleted;
  }

  async deleteByPageId(pageId: string, session?: ClientSession): Promise<void> {
    await this.componentModel
      .deleteMany({ pageId: new Types.ObjectId(pageId) }, { session })
      .exec();
  }

  async reorder(
    components: { id: string; order: number }[],
    session?: ClientSession,
  ): Promise<void> {
    const bulkOps = components.map((c) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(c.id) },
        update: { $set: { order: c.order } },
      },
    }));

    await this.componentModel.bulkWrite(bulkOps, { session });
  }

  async cloneComponents(
    sourcePageId: string,
    targetPageId: string,
    session?: ClientSession,
  ): Promise<CmsComponentDocument[]> {
    const sourceComponents = await this.componentModel
      .find({ pageId: new Types.ObjectId(sourcePageId) })
      .sort({ order: 1 })
      .exec();

    if (sourceComponents.length === 0) return [];

    const clones = sourceComponents.map((c) => {
      const obj = c.toObject() as any;
      delete obj._id;
      delete obj.id;
      delete obj.createdAt;
      delete obj.updatedAt;
      return {
        ...obj,
        pageId: new Types.ObjectId(targetPageId),
      };
    });

    return (await this.componentModel.insertMany(clones, { session })) as unknown as CmsComponentDocument[];
  }
}
