import { CreateCmsPageDto, QueryCmsPageDto, UpdateCmsPageDto } from './dto/page.dto';
import { CmsPagesService } from './pages.service';
export declare class AdminCmsPagesController {
    private readonly pagesService;
    constructor(pagesService: CmsPagesService);
    create(dto: CreateCmsPageDto): Promise<import("./schemas/page.schema").CmsPageDocument>;
    findAll(queryDto: QueryCmsPageDto): Promise<import("../../../common/interface").IPaginatedResponse<import("./schemas/page.schema").CmsPageDocument>>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateCmsPageDto): Promise<import("./schemas/page.schema").CmsPageDocument>;
    remove(id: string): Promise<{
        message: string;
    }>;
    duplicate(id: string): Promise<import("./schemas/page.schema").CmsPageDocument>;
}
