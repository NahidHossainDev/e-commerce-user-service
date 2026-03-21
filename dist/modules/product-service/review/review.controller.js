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
exports.ReviewController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../../common/decorators");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const interface_1 = require("../../../common/interface");
const swagger_helper_1 = require("../../../utils/response/swagger.helper");
const create_review_dto_1 = require("./dto/create-review.dto");
const review_query_options_dto_1 = require("./dto/review-query-options.dto");
const review_response_dto_1 = require("./dto/review-response.dto");
const update_review_dto_1 = require("./dto/update-review.dto");
const review_service_1 = require("./review.service");
const review_schema_1 = require("./schemas/review.schema");
let ReviewController = class ReviewController {
    reviewService;
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    async create(user, createReviewDto) {
        return (await this.reviewService.create(user.id, createReviewDto));
    }
    async findAll(query) {
        return (await this.reviewService.findAll(query));
    }
    async getSummary(productId) {
        return (await this.reviewService.getRatingSummary(productId));
    }
    async findOne(id) {
        return (await this.reviewService.findOne(id));
    }
    async update(id, updateReviewDto, admin) {
        return (await this.reviewService.update(id, updateReviewDto, admin.id));
    }
    async remove(id) {
        return (await this.reviewService.remove(id));
    }
    async vote(id, user, voteType) {
        return (await this.reviewService.vote(id, user.id, voteType));
    }
};
exports.ReviewController = ReviewController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new review' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 201,
        description: 'Review created successfully.',
        type: review_response_dto_1.ReviewResponseDto,
    }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_review_dto_1.CreateReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve all reviews with pagination and filters' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Paginated list of reviews.',
        type: review_response_dto_1.PaginatedReviewsResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [review_query_options_dto_1.ReviewQueryOptionsDto]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rating summary for a product' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Rating summary retrieved successfully.',
        type: review_response_dto_1.RatingSummaryResponseDto,
    }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single review by ID' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Review found.',
        type: review_response_dto_1.ReviewResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, decorators_1.Roles)(interface_1.UserRole.ADMIN, interface_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a review (Admin only)' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Review updated successfully.',
        type: review_response_dto_1.ReviewResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_review_dto_1.UpdateReviewDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, decorators_1.Roles)(interface_1.UserRole.ADMIN, interface_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a review (Admin only)' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 200,
        description: 'Review deleted successfully.',
        type: review_response_dto_1.ReviewResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/vote'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Vote on a review' }),
    (0, swagger_helper_1.ApiWrappedResponse)({
        status: 201,
        description: 'Vote recorded successfully.',
        type: review_response_dto_1.ReviewResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.CurrentUser)()),
    __param(2, (0, common_1.Body)('voteType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], ReviewController.prototype, "vote", null);
exports.ReviewController = ReviewController = __decorate([
    (0, swagger_1.ApiTags)('Review'),
    (0, common_1.Controller)('review'),
    __metadata("design:paramtypes", [review_service_1.ReviewService])
], ReviewController);
//# sourceMappingURL=review.controller.js.map