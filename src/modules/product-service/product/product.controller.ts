import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import { ProductQueryDto } from './dto/product-query-options.dto';
import {
  PaginatedProductsResponseDto,
  ProductResponseDto,
} from './dto/product-response.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products with filtering, search and pagination',
  })
  @ApiWrappedResponse({
    status: 200,
    description: 'Paginated list of products.',
    type: PaginatedProductsResponseDto,
  })
  async findAll(
    @Query() queryDto: ProductQueryDto,
  ): Promise<PaginatedProductsResponseDto> {
    return (await this.productService.findAllPublic(
      queryDto,
    )) as unknown as PaginatedProductsResponseDto;
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get a product by ID or slug' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Product found.',
    type: ProductResponseDto,
  })
  async findOne(
    @Param('idOrSlug') idOrSlug: string,
  ): Promise<ProductResponseDto> {
    return (await this.productService.findOnePublic(
      idOrSlug,
    )) as unknown as ProductResponseDto;
  }
}
