import { CmsComponentType } from '../enums/component.enum';
export interface ConfigurableField {
    name: string;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'text' | 'html';
    required: boolean;
    defaultValue?: any;
    description?: string;
    options?: {
        label: string;
        value: any;
    }[];
}
export interface ComponentTypeDefinition {
    type: CmsComponentType;
    label: string;
    description: string;
    configurableFields: ConfigurableField[];
}
export declare const COMPONENT_REGISTRY: ComponentTypeDefinition[];
