import { BrandService } from './brand.service';
import { BrandResponseDto, PaginatedBrandsResponseDto } from './dto/brand-response.dto';
import { BrandQueryOptionsDto } from './dto/brand-query-options.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandController {
    private readonly brandService;
    constructor(brandService: BrandService);
    create(createBrandDto: CreateBrandDto): Promise<BrandResponseDto>;
    findAll(query: BrandQueryOptionsDto): Promise<PaginatedBrandsResponseDto>;
    findOne(id: string): Promise<BrandResponseDto>;
    update(id: string, updateBrandDto: UpdateBrandDto): Promise<BrandResponseDto>;
    remove(id: string): Promise<BrandResponseDto>;
}
