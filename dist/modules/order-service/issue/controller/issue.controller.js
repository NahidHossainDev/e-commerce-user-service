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
exports.IssueController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../../common/guards/jwt-auth.guard");
const swagger_helper_1 = require("../../../../utils/response/swagger.helper");
const issue_dto_1 = require("../dto/issue.dto");
const issue_service_1 = require("../issue.service");
const issue_schema_1 = require("../schemas/issue.schema");
let IssueController = class IssueController {
    issueService;
    constructor(issueService) {
        this.issueService = issueService;
    }
    create(dto, req) {
        return this.issueService.createIssue(req.user._id, dto);
    }
    findAllByUser(query, req) {
        return this.issueService.findAllByUser(req.user._id, query);
    }
    findById(id, req) {
        return this.issueService.findById(id, req.user._id);
    }
};
exports.IssueController = IssueController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Report a new issue for an order (Customer)' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 201,
        description: 'Issue reported successfully',
        type: issue_schema_1.Issue,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [issue_dto_1.CreateIssueDto, Object]),
    __metadata("design:returntype", void 0)
], IssueController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reported issues for current user' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'List of user issues with pagination',
        type: issue_dto_1.PaginatedIssueResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [issue_dto_1.IssueQueryOptionsDto, Object]),
    __metadata("design:returntype", void 0)
], IssueController.prototype, "findAllByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get issue details by ID (Customer)' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Issue details',
        type: issue_schema_1.Issue,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IssueController.prototype, "findById", null);
exports.IssueController = IssueController = __decorate([
    (0, swagger_1.ApiTags)('Private / Issues'),
    (0, common_1.Controller)('issues'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [issue_service_1.IssueService])
], IssueController);
//# sourceMappingURL=issue.controller.js.map