import { Connection } from 'mongoose';
import { IPaginatedResponse } from 'src/common/interface';
import { CmsComponentsService } from '../components/components.service';
import { CreateCmsPageDto, QueryCmsPageDto, UpdateCmsPageDto } from './dto/page.dto';
import { CmsPagesRepository } from './pages.repository';
import { CmsPageDocument } from './schemas/page.schema';
export declare class CmsPagesService {
    private readonly pagesRepository;
    private readonly componentsService;
    private readonly connection;
    constructor(pagesRepository: CmsPagesRepository, componentsService: CmsComponentsService, connection: Connection);
    create(dto: CreateCmsPageDto): Promise<CmsPageDocument>;
    findOne(id: string): Promise<CmsPageDocument>;
    findOneBySlug(slug: string): Promise<CmsPageDocument>;
    getPageForStorefront(slug: string, previewToken?: string): Promise<any>;
    getAdminPageDetails(id: string): Promise<any>;
    findAll(queryDto: QueryCmsPageDto): Promise<IPaginatedResponse<CmsPageDocument>>;
    update(id: string, dto: UpdateCmsPageDto): Promise<CmsPageDocument>;
    remove(id: string): Promise<void>;
    duplicatePage(id: string): Promise<CmsPageDocument>;
    generatePreviewToken(pageId: string): string;
    validatePreviewToken(pageId: string, token: string): boolean;
}
