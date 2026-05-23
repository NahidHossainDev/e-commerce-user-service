import { ClientSession } from 'mongoose';
import { CmsComponentsRepository } from './components.repository';
import { CreateCmsComponentDto, ReorderComponentsDto, UpdateCmsComponentDto } from './dto/component.dto';
import { CmsComponentDocument } from './schemas/component.schema';
import { ComponentValidationService } from './validation.service';
export declare class CmsComponentsService {
    private readonly componentsRepository;
    private readonly validationService;
    constructor(componentsRepository: CmsComponentsRepository, validationService: ComponentValidationService);
    create(pageId: string, dto: CreateCmsComponentDto, session?: ClientSession): Promise<CmsComponentDocument>;
    findOne(id: string): Promise<CmsComponentDocument>;
    findByPageId(pageId: string, filterVisible?: boolean): Promise<CmsComponentDocument[]>;
    update(id: string, dto: UpdateCmsComponentDto, session?: ClientSession): Promise<CmsComponentDocument>;
    remove(id: string, session?: ClientSession): Promise<CmsComponentDocument>;
    removeByPageId(pageId: string, session?: ClientSession): Promise<void>;
    reorder(dto: ReorderComponentsDto, session?: ClientSession): Promise<void>;
    duplicateComponent(id: string, session?: ClientSession): Promise<CmsComponentDocument>;
    cloneComponentsForPage(sourcePageId: string, targetPageId: string, session?: ClientSession): Promise<CmsComponentDocument[]>;
}
