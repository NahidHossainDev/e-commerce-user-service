import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginateOptions } from 'src/common/constants';
import { paginationHelpers, pick } from 'src/utils/helpers';
import { getPaginatedData } from 'src/utils/mongodb/getPaginatedData';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryOptions } from './dto/user-query-options.dto';
import { User, UserDocument } from './user.schema';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(payload: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(payload);
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
    const updated = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('User not found');
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
