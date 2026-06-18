import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import { CategoryService } from '../category.service';
import {
  CategoryResponseDto,
  CategoryTreeResponseDto,
  MinimalCategoryTreeDto,
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

  @Get('parent-category')
  @ApiOperation({ summary: 'Get all parent categories (level 0)' })
  @ApiWrappedResponse({
    status: 200,
    description: 'List of parent categories.',
    type: MinimalCategoryTreeDto,
    isArray: true,
  })
  async getParentCategories(): Promise<MinimalCategoryTreeDto[]> {
    const categories = await this.categoryService.getParentCategories();
    return categories as unknown as MinimalCategoryTreeDto[];
  }

  @Get(':parentId/sub-category')
  @ApiOperation({ summary: 'Get sub-categories for a parent category' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Nested sub-categories for the parent.',
    type: MinimalCategoryTreeDto,
    isArray: true,
  })
  async getSubCategories(
    @Param('parentId') parentId: string,
  ): Promise<MinimalCategoryTreeDto[]> {
    const categories = await this.categoryService.getSubCategories(parentId);
    return categories as unknown as MinimalCategoryTreeDto[];
  }

  @Get('by-ids')
  @ApiOperation({ summary: 'Get categories by a list of IDs' })
  @ApiWrappedResponse({
    status: 200,
    description: 'List of categories matching the IDs.',
    type: CategoryResponseDto,
    isArray: true,
  })
  async findByIds(
    @Query('ids') ids: string,
  ): Promise<CategoryResponseDto[]> {
    const idList = ids ? ids.split(',') : [];
    const categories = await this.categoryService.findByIds(idList);
    return categories as unknown as CategoryResponseDto[];
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
