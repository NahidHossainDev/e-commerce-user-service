import { CmsPagesService } from './pages.service';
export declare class CmsPagesController {
    private readonly pagesService;
    constructor(pagesService: CmsPagesService);
    getHomePage(previewToken?: string): Promise<any>;
    getPage(slug: string, previewToken?: string): Promise<any>;
}
