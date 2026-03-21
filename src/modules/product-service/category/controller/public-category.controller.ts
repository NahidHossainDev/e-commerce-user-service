import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import { CategoryService } from '../category.service';
import {
  CategoryResponseDto,
  CategoryTreeResponseDto,
} from '../dto/category-response.dto';

@ApiTags('Categories')
@Controller('categories')
export class PublicCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active categories' })
  @ApiWrappedResponse({
    status: 200,
    description: 'List of active categories.',
    type: CategoryResponseDto,
    isArray: true,
  })
  async findAll(): Promise<CategoryResponseDto[]> {
    return (await this.categoryService.findAllPublic()) as unknown as CategoryResponseDto[];
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get the full category tree' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Hierarchical tree of categories.',
    type: CategoryTreeResponseDto,
    isArray: true,
  })
  async getTree(): Promise<CategoryTreeResponseDto[]> {
    return (await this.categoryService.getPublicCategoryTree()) as unknown as CategoryTreeResponseDto[];
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a category by slug' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Category found.',
    type: CategoryResponseDto,
  })
  async getBySlug(@Param('slug') slug: string): Promise<CategoryResponseDto> {
    return (await this.categoryService.getBySlug(
      slug,
    )) as unknown as CategoryResponseDto;
  }
}
