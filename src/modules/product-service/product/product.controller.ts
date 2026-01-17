import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductQueryDto } from './dto/product-query-options.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products with filtering, search and pagination',
  })
  findAll(@Query() queryDto: ProductQueryDto) {
    return this.productService.findAllPublic(queryDto);
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get a product by ID or slug' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.productService.findOnePublic(idOrSlug);
  }
}
