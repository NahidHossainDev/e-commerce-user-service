import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginateOptions } from 'src/common/constants';
import {
  ImageAttachedEvent,
  ImageDetachedEvent,
  MediaEvent,
} from 'src/common/events/media.events';
import { paginationHelpers, pick } from 'src/utils/helpers';
import { extractMediaIdFromUrl } from 'src/utils/helpers/media-helper';
import { getPaginatedData } from 'src/utils/mongodb/getPaginatedData';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryOptions } from './dto/user-query-options.dto';
import { User, UserDocument } from './user.schema';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(payload: CreateUserDto): Promise<UserDocument> {
    const savedUser = await this.userModel.create(payload);

    if (savedUser.profile?.imageUrl) {
      const mediaId = extractMediaIdFromUrl(savedUser.profile.imageUrl);
      if (mediaId) {
        this.eventEmitter.emit(
          MediaEvent.IMAGE_ATTACHED,
          new ImageAttachedEvent(mediaId, savedUser._id.toString(), 'user'),
        );
      }
    }

    return savedUser;
  }

  async findAll(query: UserQueryOptions) {
    const paginateQueries = pick(query, paginateOptions);
    const filters = pick(query, ['searchTerm']);

    const pagination = paginationHelpers.calculatePagination(paginateQueries);

    return await getPaginatedData<UserDocument>({
      model: this.userModel,
      paginationQuery: pagination,
      filterQuery: filters,
    });
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const oldUser = await this.userModel.findById(id);
    if (!oldUser) throw new NotFoundException('User not found');

    const updated = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    if (!updated) throw new NotFoundException('User not found');

    // --- Media Events ---
    const oldImageUrl = oldUser.profile?.imageUrl;
    const newImageUrl = (updateUserDto.profile as any)?.imageUrl;

    if (newImageUrl && newImageUrl !== oldImageUrl) {
      const oldId = extractMediaIdFromUrl(oldImageUrl);
      const newId = extractMediaIdFromUrl(newImageUrl);
      const userId = updated._id.toString();

      if (oldId) {
        this.eventEmitter.emit(
          MediaEvent.IMAGE_DETACHED,
          new ImageDetachedEvent(oldId),
        );
      }
      if (newId) {
        this.eventEmitter.emit(
          MediaEvent.IMAGE_ATTACHED,
          new ImageAttachedEvent(newId, userId, 'user'),
        );
      }
    }

    return updated;
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const deleted = await this.userModel.findByIdAndDelete(id);

    if (user.profile?.imageUrl) {
      const mediaId = extractMediaIdFromUrl(user.profile.imageUrl);
      if (mediaId) {
        this.eventEmitter.emit(
          MediaEvent.IMAGE_DETACHED,
          new ImageDetachedEvent(mediaId),
        );
      }
    }

    return deleted;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phoneNumber });
  }

  async updateRefreshToken(userId: string, hashedToken: string | null) {
    return this.userModel.findByIdAndUpdate(userId, {
      'security.refreshTokenHash': hashedToken,
    });
  }
  async updateSecurity(
    userId: string,
    securityUpdates: Partial<User['security']>,
  ) {
    const updateQuery = Object.keys(securityUpdates).reduce((acc, key) => {
      acc[`security.${key}`] = securityUpdates[key];
      return acc;
    }, {});

    return this.userModel.findByIdAndUpdate(userId, updateQuery, { new: true });
  }
}
