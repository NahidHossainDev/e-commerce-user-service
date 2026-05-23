import { CmsComponentType } from '../enums/component.enum';
export declare class ComponentSettingsDto {
    container?: string;
    fullWidth?: boolean;
    backgroundColor?: string;
    paddingTop?: string;
    paddingBottom?: string;
}
export declare class CreateCmsComponentDto {
    componentType: CmsComponentType;
    order: number;
    isVisible?: boolean;
    settings?: ComponentSettingsDto;
    data: Record<string, any>;
}
declare const UpdateCmsComponentDto_base: import("@nestjs/common").Type<Partial<CreateCmsComponentDto>>;
export declare class UpdateCmsComponentDto extends UpdateCmsComponentDto_base {
}
export declare class ReorderItemDto {
    id: string;
    order: number;
}
export declare class ReorderComponentsDto {
    components: ReorderItemDto[];
}
export {};
