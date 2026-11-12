import { AddIssueNoteDto, IssueQueryOptionsDto, ResolveIssueDto, UpdateIssueStatusDto } from '../dto/issue.dto';
import { IssueService } from '../issue.service';
import { Issue } from '../schemas/issue.schema';
export declare class AdminIssueController {
    private readonly issueService;
    constructor(issueService: IssueService);
    findAll(query: IssueQueryOptionsDto): Promise<{
        data: Issue[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<Issue>;
    updateStatus(id: string, dto: UpdateIssueStatusDto, req: any): Promise<Issue>;
    resolve(id: string, dto: ResolveIssueDto, req: any): Promise<Issue>;
    addNote(id: string, dto: AddIssueNoteDto, req: any): Promise<Issue>;
}
