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
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/interface';
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import { BrandService } from './brand.service';
import { BrandQueryOptionsDto } from './dto/brand-query-options.dto';
import {
  BrandResponseDto,
  PaginatedBrandsResponseDto,
} from './dto/brand-response.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@ApiTags('Brands')
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
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

  @Get('by-ids')
  @ApiOperation({ summary: 'Get categories by a list of IDs' })
  @ApiWrappedResponse({
    status: 200,
    description: 'List of categories matching the IDs.',
    type: BrandResponseDto,
    isArray: true,
  })
  async findByIds(
    @Query('ids') ids: string,
  ): Promise<BrandResponseDto[]> {
    const idList = ids ? ids.split(',') : [];
    const brands = await this.brandService.findByIds(idList);
    return brands as unknown as BrandResponseDto[];
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
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
