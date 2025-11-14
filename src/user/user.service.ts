import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginate } from 'src/utils/mongodb/pagination';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  async findAll(query: any) {
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
