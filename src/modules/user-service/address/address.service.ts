import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Address, AddressDocument } from './address.schema';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
  ) {}
  async create(createAddressDto: CreateAddressDto) {
    const count = await this.addressModel.countDocuments({
      userId: createAddressDto.userId,
    });

    if (count >= 5) {
      throw new BadRequestException('Maximum 5 addresses allowed per user');
    }

    return this.addressModel.create(createAddressDto);
  }

  async findAllByUser(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }
    const addresses = await this.addressModel
      .find({ userId })
      .sort({ isDefault: -1 })
      .exec();
    return addresses;
  }

  async findOne(id: string) {
    const address = await this.addressModel.findById(id).exec();
    if (!address) throw new Error('Address not found');
    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const updated = await this.addressModel.findByIdAndUpdate(
      id,
      updateAddressDto,
      {
        new: true,
      },
    );
    if (!updated) throw new Error('Address not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.addressModel.findByIdAndDelete(id);
    if (!deleted) throw new Error('Address not found');
    return { message: 'Address deleted successfully' };
  }

  async setDefaultAddress(userId: string, addressId: string) {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(addressId)) {
      throw new Error('Invalid user ID or address ID');
    }

    // Unset previous default address
    await this.addressModel.updateMany(
      { userId: userId, isDefault: true },
      { isDefault: false },
    );

    // Set new default address
    const updated = await this.addressModel.findByIdAndUpdate(
      addressId,
      { isDefault: true },
      { new: true },
    );

    if (!updated) throw new Error('Address not found');
    return updated;
  }
}
