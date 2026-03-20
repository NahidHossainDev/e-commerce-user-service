import { Model, Types } from 'mongoose';
import { AddressValidateEvent, AddressValidationResult } from 'src/common/events/user.events';
import { Address, AddressDocument } from './address.schema';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class AddressService {
    private readonly addressModel;
    constructor(addressModel: Model<AddressDocument>);
    create(createAddressDto: CreateAddressDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Address, {}, {}> & Address & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Address, {}, {}> & Address & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAllByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Address, {}, {}> & Address & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Address, {}, {}> & Address & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Address, {}, {}> & Address & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Address, {}, {}> & Address & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, updateAddressDto: UpdateAddressDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Address, {}, {}> & Address & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Address, {}, {}> & Address & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    setDefaultAddress(userId: string, addressId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Address, {}, {}> & Address & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Address, {}, {}> & Address & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    validateAddressOwnership(payload: AddressValidateEvent): Promise<AddressValidationResult>;
}
