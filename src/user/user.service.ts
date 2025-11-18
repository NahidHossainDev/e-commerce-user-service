import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginateOptions } from 'src/common/constants';
import { paginationHelpers, pick } from 'src/utils/helpers';
import { paginate } from 'src/utils/mongodb/pagination';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryOptions } from './dto/user-query-options.dto';
import { User } from './user.schema';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(payload: CreateUserDto): Promise<Omit<User, 'password'>> {
    return this.userModel.create(payload);
  }

  async findAll(query: UserQueryOptions) {
    const paginateQueries = pick(query, paginateOptions);
    const filters = pick(query, ['searchTerm']);

    const pagiantion = paginationHelpers.calculatePagination(paginateQueries);

    return await paginate(this.userModel);
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
}
