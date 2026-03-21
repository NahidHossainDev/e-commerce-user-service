import { CategoryService } from '../category.service';
import { CategoryQueryOptionsDto } from '../dto/category-query-options.dto';
import { CategoryResponseDto, PaginatedCategoriesResponseDto } from '../dto/category-response.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
export declare class AdminCategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto>;
    findAll(query: CategoryQueryOptionsDto): Promise<PaginatedCategoriesResponseDto>;
    findOne(id: string): Promise<CategoryResponseDto>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto>;
    remove(id: string): Promise<CategoryResponseDto>;
}
