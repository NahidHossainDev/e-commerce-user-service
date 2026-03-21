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
import { CategoryService } from '../category.service';
import { CategoryQueryOptionsDto } from '../dto/category-query-options.dto';
import {
  CategoryResponseDto,
  PaginatedCategoriesResponseDto,
} from '../dto/category-response.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@ApiTags('Categories')
@Controller('admin/categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiWrappedResponse({
    status: 201,
    description: 'Category created successfully.',
    type: CategoryResponseDto,
  })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return (await this.categoryService.create(
      createCategoryDto,
    )) as unknown as CategoryResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories with pagination and filtering' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Paginated list of categories.',
    type: PaginatedCategoriesResponseDto,
  })
  async findAll(
    @Query() query: CategoryQueryOptionsDto,
  ): Promise<PaginatedCategoriesResponseDto> {
    return (await this.categoryService.findAll(
      query,
    )) as unknown as PaginatedCategoriesResponseDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Category found.',
    type: CategoryResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
    return (await this.categoryService.findOne(
      id,
    )) as unknown as CategoryResponseDto;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Category updated successfully.',
    type: CategoryResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return (await this.categoryService.update(
      id,
      updateCategoryDto,
    )) as unknown as CategoryResponseDto;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Category deleted successfully.',
    type: CategoryResponseDto,
  })
  async remove(@Param('id') id: string): Promise<CategoryResponseDto> {
    return (await this.categoryService.remove(
      id,
    )) as unknown as CategoryResponseDto;
  }
}
