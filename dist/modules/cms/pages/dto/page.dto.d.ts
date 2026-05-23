import { QueryOptions } from 'src/common/dto/queryOptions.dto';
import { CmsPageStatus, CmsPageType } from '../enums/page.enum';
export declare class CmsPageSeoDto {
    title?: string;
    description?: string;
    keywords?: string[];
}
export declare class CreateCmsPageDto {
    title: string;
    slug?: string;
    type?: CmsPageType;
    status?: CmsPageStatus;
    isHomePage?: boolean;
    seo?: CmsPageSeoDto;
}
declare const UpdateCmsPageDto_base: import("@nestjs/common").Type<Partial<CreateCmsPageDto>>;
export declare class UpdateCmsPageDto extends UpdateCmsPageDto_base {
}
export declare class QueryCmsPageDto extends QueryOptions {
    status?: CmsPageStatus;
    type?: CmsPageType;
    searchTerm?: string;
}
export {};
