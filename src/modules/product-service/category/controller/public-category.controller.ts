import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../category.service';

@ApiTags('Categories')
@Controller('categories')
export class PublicCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAllPublic();
  }

  @Get('tree')
  getTree() {
    return this.categoryService.getPublicCategoryTree();
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.categoryService.getBySlug(slug);
  }
}
