import { Model } from 'mongoose';
import { OrderDocument } from '../order/schemas/order.schema';
import { AddIssueNoteDto, CreateIssueDto, IssueQueryOptionsDto, ResolveIssueDto, UpdateIssueStatusDto } from './dto/issue.dto';
import { Issue, IssueDocument } from './schemas/issue.schema';
export declare class IssueService {
    private readonly issueModel;
    private readonly orderModel;
    constructor(issueModel: Model<IssueDocument>, orderModel: Model<OrderDocument>);
    private generateIssueNumber;
    createIssue(userId: string, dto: CreateIssueDto): Promise<Issue>;
    findAllByUser(userId: string, query: IssueQueryOptionsDto): Promise<{
        data: Issue[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAllAdmin(query: IssueQueryOptionsDto): Promise<{
        data: Issue[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string, userId?: string): Promise<Issue>;
    updateStatus(id: string, adminId: string, dto: UpdateIssueStatusDto): Promise<Issue>;
    resolveIssue(id: string, adminId: string, dto: ResolveIssueDto): Promise<Issue>;
    addNote(id: string, adminId: string, dto: AddIssueNoteDto): Promise<Issue>;
}
