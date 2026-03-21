import { CategoryService } from '../category.service';
import { CategoryResponseDto, CategoryTreeResponseDto } from '../dto/category-response.dto';
export declare class PublicCategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    findAll(): Promise<CategoryResponseDto[]>;
    getTree(): Promise<CategoryTreeResponseDto[]>;
    getBySlug(slug: string): Promise<CategoryResponseDto>;
}
