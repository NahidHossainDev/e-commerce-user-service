import { CmsComponentType } from './enums/component.enum';
export declare class ComponentValidationService {
    validateData(type: CmsComponentType, rawData: Record<string, any>): Promise<any>;
    private flattenErrors;
}
