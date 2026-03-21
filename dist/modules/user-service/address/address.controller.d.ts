import { AddressService } from './address.service';
import { AddressMessageResponseDto, AddressResponseDto } from './dto/address-response.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class AddressController {
    private readonly addressService;
    constructor(addressService: AddressService);
    create(createAddressDto: CreateAddressDto): Promise<AddressResponseDto>;
    findAll(userId: string): Promise<AddressResponseDto[]>;
    findOne(id: string): Promise<AddressResponseDto>;
    update(id: string, updateAddressDto: UpdateAddressDto): Promise<AddressResponseDto>;
    remove(id: string): Promise<AddressMessageResponseDto>;
}
