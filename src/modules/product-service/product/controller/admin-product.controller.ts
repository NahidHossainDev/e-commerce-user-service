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
import { UserRole } from 'src/modules/user-service/user/user.schema';
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import { ProductQueryDto } from '../dto/product-query-options.dto';
import {
  PaginatedProductsResponseDto,
  ProductResponseDto,
} from '../dto/product-response.dto';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import {
  BulkUpdateStatusDto,
  UpdateProductStatusDto,
} from '../dto/update-product-status.dto';
import { ProductService } from '../product.service';

@ApiTags('Admin Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/products')
export class AdminProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiWrappedResponse({
    status: 201,
    description: 'Product created successfully.',
    type: ProductResponseDto,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return (await this.productService.create(
      createProductDto,
    )) as unknown as ProductResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Get all products (Admin View)' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Paginated list of products.',
    type: PaginatedProductsResponseDto,
  })
  async findAll(
    @Query() queryDto: ProductQueryDto,
  ): Promise<PaginatedProductsResponseDto> {
    return (await this.productService.findAllAdmin(
      queryDto,
    )) as unknown as PaginatedProductsResponseDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID (Admin View)' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Product found.',
    type: ProductResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return (await this.productService.findOneAdmin(
      id,
    )) as unknown as ProductResponseDto;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Product updated successfully.',
    type: ProductResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return (await this.productService.update(
      id,
      updateProductDto,
    )) as unknown as ProductResponseDto;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a product' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Product soft-deleted successfully.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.productService.remove(id);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Hard delete a product (Permanent)' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Product hard-deleted successfully.',
  })
  async hardDelete(@Param('id') id: string): Promise<void> {
    return await this.productService.hardDelete(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update product status' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Product status updated successfully.',
    type: ProductResponseDto,
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateProductStatusDto,
  ): Promise<ProductResponseDto> {
    return (await this.productService.updateStatus(
      id,
      dto.status,
    )) as unknown as ProductResponseDto;
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted product' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Product restored successfully.',
    type: ProductResponseDto,
  })
  async restore(@Param('id') id: string): Promise<ProductResponseDto> {
    return (await this.productService.restore(
      id,
    )) as unknown as ProductResponseDto;
  }

  @Patch('bulk/status')
  @ApiOperation({ summary: 'Bulk update product status' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Bulk update initiated.',
  })
  async bulkUpdateStatus(@Body() dto: BulkUpdateStatusDto): Promise<any> {
    return await this.productService.bulkUpdateStatus(dto.ids, dto.status);
  }
}
