import { Issue, IssuePriority, IssueStatus, IssueType, ResolutionAction } from '../schemas/issue.schema';
export declare class IssueItemDto {
    productId: string;
    name?: string;
    variantSku?: string;
    quantity?: number;
    notes?: string;
}
export declare class CreateIssueDto {
    orderId: string;
    type: IssueType;
    subject: string;
    description: string;
    priority?: IssuePriority;
    items?: IssueItemDto[];
    attachments?: string[];
}
export declare class UpdateIssueStatusDto {
    status: IssueStatus;
    notes?: string;
}
export declare class ResolveIssueDto {
    resolutionNotes: string;
    resolutionAction?: ResolutionAction;
    internalNotes?: string;
}
export declare class AddIssueNoteDto {
    notes: string;
}
export declare class IssueQueryOptionsDto {
    page?: number;
    limit?: number;
    search?: string;
    status?: IssueStatus;
    type?: IssueType;
    priority?: IssuePriority;
    orderId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class PaginatedIssueResponseDto {
    data: Issue[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
