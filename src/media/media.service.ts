import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMediaDto, UpdateMediaDto } from './dto/media.dto';
import { ProductMedia, ProductMediaDocument } from './schemas/media.schema';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(ProductMedia.name)
    private mediaModel: Model<ProductMediaDocument>,
  ) {}

  async create(createMediaDto: CreateMediaDto): Promise<ProductMediaDocument> {
    const existing = await this.mediaModel.findOne({ productId: new Types.ObjectId(createMediaDto.productId) });
    if (existing) {
      throw new ConflictException('Media for this product already exists');
    }

    const createdMedia = new this.mediaModel({
      ...createMediaDto,
      productId: new Types.ObjectId(createMediaDto.productId),
    });
    return createdMedia.save();
  }

  async findByProductId(productId: string): Promise<ProductMediaDocument> {
    const media = await this.mediaModel.findOne({ productId: new Types.ObjectId(productId) });
    if (!media) {
      throw new NotFoundException(`Media for product ${productId} not found`);
    }
    return media;
  }

  async update(productId: string, updateMediaDto: UpdateMediaDto): Promise<ProductMediaDocument> {
    const media = await this.mediaModel.findOneAndUpdate(
      { productId: new Types.ObjectId(productId) },
      { $set: updateMediaDto },
      { new: true },
    );

    if (!media) {
      throw new NotFoundException(`Media for product ${productId} not found`);
    }
    return media;
  }

  async remove(productId: string): Promise<void> {
    const result = await this.mediaModel.deleteOne({ productId: new Types.ObjectId(productId) });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Media for product ${productId} not found`);
    }
  }
}
