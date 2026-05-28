import { CmsComponentsService } from './components.service';
import { CreateCmsComponentDto, ReorderComponentsDto, UpdateCmsComponentDto } from './dto/component.dto';
export declare class AdminCmsComponentsController {
    private readonly componentsService;
    constructor(componentsService: CmsComponentsService);
    getComponentTypes(): import("./constants/component.constants").ComponentTypeDefinition[];
    create(pageId: string, dto: CreateCmsComponentDto): Promise<import("./schemas/component.schema").CmsComponentDocument>;
    reorder(dto: ReorderComponentsDto): Promise<{
        message: string;
    }>;
    update(id: string, dto: UpdateCmsComponentDto): Promise<import("./schemas/component.schema").CmsComponentDocument>;
    remove(id: string): Promise<import("./schemas/component.schema").CmsComponentDocument>;
    duplicate(id: string): Promise<import("./schemas/component.schema").CmsComponentDocument>;
}
