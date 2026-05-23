import { ClientSession, Model, Types } from 'mongoose';
import { IPaginatedResponse } from 'src/common/interface';
import { CreateCmsPageDto, QueryCmsPageDto, UpdateCmsPageDto } from './dto/page.dto';
import { CmsPageDocument } from './schemas/page.schema';
export declare class CmsPagesRepository {
    private readonly pageModel;
    constructor(pageModel: Model<CmsPageDocument>);
    create(dto: CreateCmsPageDto, session?: ClientSession): Promise<CmsPageDocument>;
    findById(id: string): Promise<CmsPageDocument | null>;
    findBySlug(slug: string): Promise<CmsPageDocument | null>;
    findHomePage(): Promise<CmsPageDocument | null>;
    update(id: string, dto: UpdateCmsPageDto & {
        componentIds?: Types.ObjectId[];
    }, session?: ClientSession): Promise<CmsPageDocument>;
    delete(id: string, session?: ClientSession): Promise<CmsPageDocument>;
    findAll(queryDto: QueryCmsPageDto): Promise<IPaginatedResponse<CmsPageDocument>>;
    unsetHomePage(exceptId: string, session?: ClientSession): Promise<void>;
}
