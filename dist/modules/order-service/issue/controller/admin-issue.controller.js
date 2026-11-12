"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminIssueController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../../../../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../../common/guards/roles.guard");
const user_schema_1 = require("../../../user-service/user/user.schema");
const swagger_helper_1 = require("../../../../utils/response/swagger.helper");
const issue_dto_1 = require("../dto/issue.dto");
const issue_service_1 = require("../issue.service");
const issue_schema_1 = require("../schemas/issue.schema");
let AdminIssueController = class AdminIssueController {
    issueService;
    constructor(issueService) {
        this.issueService = issueService;
    }
    findAll(query) {
        return this.issueService.findAllAdmin(query);
    }
    findById(id) {
        return this.issueService.findById(id);
    }
    updateStatus(id, dto, req) {
        return this.issueService.updateStatus(id, req.user._id, dto);
    }
    resolve(id, dto, req) {
        return this.issueService.resolveIssue(id, req.user._id, dto);
    }
    addNote(id, dto, req) {
        return this.issueService.addNote(id, req.user._id, dto);
    }
};
exports.AdminIssueController = AdminIssueController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all order issues with search, filter, and sorting (Admin)' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'List of order issues with pagination',
        type: issue_dto_1.PaginatedIssueResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [issue_dto_1.IssueQueryOptionsDto]),
    __metadata("design:returntype", void 0)
], AdminIssueController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order issue details (Admin)' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Order issue details',
        type: issue_schema_1.Issue,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminIssueController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update issue status (Admin)' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Issue status updated',
        type: issue_schema_1.Issue,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, issue_dto_1.UpdateIssueStatusDto, Object]),
    __metadata("design:returntype", void 0)
], AdminIssueController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/resolve'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve an order issue (Admin)' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Issue resolved',
        type: issue_schema_1.Issue,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, issue_dto_1.ResolveIssueDto, Object]),
    __metadata("design:returntype", void 0)
], AdminIssueController.prototype, "resolve", null);
__decorate([
    (0, common_1.Post)(':id/notes'),
    (0, swagger_1.ApiOperation)({ summary: 'Add internal note to issue (Admin)' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 201,
        description: 'Note added to issue',
        type: issue_schema_1.Issue,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, issue_dto_1.AddIssueNoteDto, Object]),
    __metadata("design:returntype", void 0)
], AdminIssueController.prototype, "addNote", null);
exports.AdminIssueController = AdminIssueController = __decorate([
    (0, swagger_1.ApiTags)('Admin / Issues'),
    (0, common_1.Controller)('admin/issues'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [issue_service_1.IssueService])
], AdminIssueController);
//# sourceMappingURL=admin-issue.controller.js.map