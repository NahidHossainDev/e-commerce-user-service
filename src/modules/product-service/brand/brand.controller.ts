import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import { BrandService } from './brand.service';
import {
  BrandResponseDto,
  PaginatedBrandsResponseDto,
} from './dto/brand-response.dto';
import { BrandQueryOptionsDto } from './dto/brand-query-options.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@ApiTags('Brands')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiWrappedResponse({
    status: 201,
    description: 'The brand has been successfully created.',
    type: BrandResponseDto,
  })
  async create(
    @Body() createBrandDto: CreateBrandDto,
  ): Promise<BrandResponseDto> {
    return (await this.brandService.create(
      createBrandDto,
    )) as unknown as BrandResponseDto;
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all brands with pagination and filtering',
  })
  @ApiWrappedResponse({
    status: 200,
    description: 'Paginated list of brands.',
    type: PaginatedBrandsResponseDto,
  })
  async findAll(@Query() query: BrandQueryOptionsDto) {
    return (await this.brandService.findAll(
      query,
    )) as unknown as PaginatedBrandsResponseDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a brand by ID' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Brand found.',
    type: BrandResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<BrandResponseDto> {
    return (await this.brandService.findOne(id)) as unknown as BrandResponseDto;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a brand by ID' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Brand updated successfully.',
    type: BrandResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<BrandResponseDto> {
    return (await this.brandService.update(
      id,
      updateBrandDto,
    )) as unknown as BrandResponseDto;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a brand by ID' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Brand deleted successfully.',
    type: BrandResponseDto,
  })
  async remove(@Param('id') id: string): Promise<BrandResponseDto> {
    return (await this.brandService.remove(id)) as unknown as BrandResponseDto;
  }
}
