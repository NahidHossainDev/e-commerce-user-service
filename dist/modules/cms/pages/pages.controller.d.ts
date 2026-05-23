import { CmsPagesService } from './pages.service';
export declare class CmsPagesController {
    private readonly pagesService;
    constructor(pagesService: CmsPagesService);
    getPage(slug: string, previewToken?: string): Promise<any>;
}
