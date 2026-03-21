import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import { AddressService } from './address.service';
import {
  AddressMessageResponseDto,
  AddressResponseDto,
} from './dto/address-response.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Address')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  @ApiWrappedResponse({
    status: 201,
    description: 'Address created successfully.',
    type: AddressResponseDto,
  })
  async create(
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<AddressResponseDto> {
    return (await this.addressService.create(
      createAddressDto,
    )) as unknown as AddressResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Get all addresses for a user' })
  @ApiWrappedResponse({
    status: 200,
    description: 'List of user addresses.',
    type: AddressResponseDto,
    isArray: true,
  })
  async findAll(
    @Query('userId') userId: string,
  ): Promise<AddressResponseDto[]> {
    return (await this.addressService.findAllByUser(
      userId,
    )) as unknown as AddressResponseDto[];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single address by ID' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Address found.',
    type: AddressResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<AddressResponseDto> {
    return (await this.addressService.findOne(
      id,
    )) as unknown as AddressResponseDto;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an address by ID' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Address updated successfully.',
    type: AddressResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<AddressResponseDto> {
    return (await this.addressService.update(
      id,
      updateAddressDto,
    )) as unknown as AddressResponseDto;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address by ID' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Address deleted successfully.',
    type: AddressMessageResponseDto,
  })
  async remove(@Param('id') id: string): Promise<AddressMessageResponseDto> {
    return (await this.addressService.remove(
      id,
    )) as unknown as AddressMessageResponseDto;
  }
}
