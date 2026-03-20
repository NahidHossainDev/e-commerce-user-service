import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class AddressController {
    private readonly addressService;
    constructor(addressService: AddressService);
    create(createAddressDto: CreateAddressDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./address.schema").Address, {}, {}> & import("./address.schema").Address & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./address.schema").Address, {}, {}> & import("./address.schema").Address & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./address.schema").Address, {}, {}> & import("./address.schema").Address & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./address.schema").Address, {}, {}> & import("./address.schema").Address & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./address.schema").Address, {}, {}> & import("./address.schema").Address & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./address.schema").Address, {}, {}> & import("./address.schema").Address & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, updateAddressDto: UpdateAddressDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./address.schema").Address, {}, {}> & import("./address.schema").Address & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./address.schema").Address, {}, {}> & import("./address.schema").Address & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
