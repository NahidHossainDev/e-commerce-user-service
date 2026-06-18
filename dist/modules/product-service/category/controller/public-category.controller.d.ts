import { CategoryService } from '../category.service';
import { CategoryResponseDto, CategoryTreeResponseDto, MinimalCategoryTreeDto } from '../dto/category-response.dto';
export declare class PublicCategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    findAll(): Promise<CategoryResponseDto[]>;
    getTree(): Promise<CategoryTreeResponseDto[]>;
    getParentCategories(): Promise<MinimalCategoryTreeDto[]>;
    getSubCategories(parentId: string): Promise<MinimalCategoryTreeDto[]>;
    findByIds(ids: string): Promise<CategoryResponseDto[]>;
    getBySlug(slug: string): Promise<CategoryResponseDto>;
}
