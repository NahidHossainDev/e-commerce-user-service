import { CreateIssueDto, IssueQueryOptionsDto } from '../dto/issue.dto';
import { IssueService } from '../issue.service';
import { Issue } from '../schemas/issue.schema';
export declare class IssueController {
    private readonly issueService;
    constructor(issueService: IssueService);
    create(dto: CreateIssueDto, req: any): Promise<Issue>;
    findAllByUser(query: IssueQueryOptionsDto, req: any): Promise<{
        data: Issue[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string, req: any): Promise<Issue>;
}
