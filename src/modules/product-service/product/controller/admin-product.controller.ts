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
import { ProductQueryDto } from '../dto/product-query-options.dto';
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
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products (Admin View)' })
  findAll(@Query() queryDto: ProductQueryDto) {
    return this.productService.findAllAdmin(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID (Admin View)' })
  findOne(@Param('id') id: string) {
    return this.productService.findOneAdmin(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a product' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'Hard delete a product (Permanent)' })
  hardDelete(@Param('id') id: string) {
    return this.productService.hardDelete(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update product status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateProductStatusDto) {
    return this.productService.updateStatus(id, dto.status);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted product' })
  restore(@Param('id') id: string) {
    return this.productService.restore(id);
  }

  @Patch('bulk/status')
  @ApiOperation({ summary: 'Bulk update product status' })
  bulkUpdateStatus(@Body() dto: BulkUpdateStatusDto) {
    return this.productService.bulkUpdateStatus(dto.ids, dto.status);
  }
}
