import { BrandService } from './brand.service';
import { BrandQueryOptionsDto } from './dto/brand-query-options.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandController {
    private readonly brandService;
    constructor(brandService: BrandService);
    create(createBrandDto: CreateBrandDto): Promise<import("./schemas/brand.schema").BrandDocument>;
    findAll(query: BrandQueryOptionsDto): Promise<import("../../../common/interface").IPaginatedResponse<import("./schemas/brand.schema").BrandDocument>>;
    findOne(id: string): Promise<import("./schemas/brand.schema").BrandDocument>;
    update(id: string, updateBrandDto: UpdateBrandDto): Promise<import("./schemas/brand.schema").BrandDocument>;
    remove(id: string): Promise<import("./schemas/brand.schema").BrandDocument>;
}
