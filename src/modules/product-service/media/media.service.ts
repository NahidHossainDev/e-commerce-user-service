import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { CreateMediaDto, UpdateMediaDto } from './dto/media.dto';
import { ProductMedia, ProductMediaDocument } from './schemas/media.schema';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(ProductMedia.name)
    private mediaModel: Model<ProductMediaDocument>,
  ) {}

  async create(
    createMediaDto: CreateMediaDto,
    session: ClientSession | null = null,
  ): Promise<ProductMediaDocument> {
    const existing = await this.mediaModel
      .findOne({
        productId: new Types.ObjectId(createMediaDto.productId),
      })
      .session(session);
    if (existing) {
      throw new ConflictException('Media for this product already exists');
    }

    const createdMedia = new this.mediaModel({
      ...createMediaDto,
      productId: new Types.ObjectId(createMediaDto.productId),
    });
    return createdMedia.save({ session: session as any });
  }

  async findByProductId(productId: string): Promise<ProductMediaDocument> {
    const media = await this.mediaModel.findOne({
      productId: new Types.ObjectId(productId),
    });
    if (!media) {
      throw new NotFoundException(`Media for product ${productId} not found`);
    }
    return media;
  }

  async update(
    productId: string,
    updateMediaDto: UpdateMediaDto,
    session: ClientSession | null = null,
  ): Promise<ProductMediaDocument> {
    const media = await this.mediaModel.findOneAndUpdate(
      { productId: new Types.ObjectId(productId) },
      { $set: updateMediaDto },
      { new: true, session: session as any },
    );

    if (!media) {
      throw new NotFoundException(`Media for product ${productId} not found`);
    }
    return media;
  }

  async remove(
    productId: string,
    session: ClientSession | null = null,
  ): Promise<void> {
    const result = await this.mediaModel
      .deleteOne({
        productId: new Types.ObjectId(productId),
      })
      .session(session);
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Media for product ${productId} not found`);
    }
  }
}
