import { ClientSession, Model } from 'mongoose';
import { CreateCmsComponentDto, UpdateCmsComponentDto } from './dto/component.dto';
import { CmsComponentDocument } from './schemas/component.schema';
export declare class CmsComponentsRepository {
    private readonly componentModel;
    constructor(componentModel: Model<CmsComponentDocument>);
    create(pageId: string, dto: CreateCmsComponentDto, session?: ClientSession): Promise<CmsComponentDocument>;
    findById(id: string): Promise<CmsComponentDocument | null>;
    findByPageId(pageId: string, filterVisible?: boolean): Promise<CmsComponentDocument[]>;
    update(id: string, dto: UpdateCmsComponentDto, session?: ClientSession): Promise<CmsComponentDocument>;
    delete(id: string, session?: ClientSession): Promise<CmsComponentDocument>;
    deleteByPageId(pageId: string, session?: ClientSession): Promise<void>;
    reorder(components: {
        id: string;
        order: number;
    }[], session?: ClientSession): Promise<void>;
    cloneComponents(sourcePageId: string, targetPageId: string, session?: ClientSession): Promise<CmsComponentDocument[]>;
}
