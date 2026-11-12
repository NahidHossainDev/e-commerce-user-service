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
exports.IssueService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("../order/schemas/order.schema");
const issue_schema_1 = require("./schemas/issue.schema");
let IssueService = class IssueService {
    issueModel;
    orderModel;
    constructor(issueModel, orderModel) {
        this.issueModel = issueModel;
        this.orderModel = orderModel;
    }
    generateIssueNumber() {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
        return `ISS-${dateStr}-${randomHex}`;
    }
    async createIssue(userId, dto) {
        const order = await this.orderModel.findById(dto.orderId);
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const orderUserId = order.userId?._id || order.userId;
        if (orderUserId && orderUserId.toString() !== userId.toString()) {
            throw new common_1.UnauthorizedException('You can only report issues for your own orders');
        }
        const issueNumber = this.generateIssueNumber();
        const items = dto.items && dto.items.length > 0
            ? dto.items.map((item) => ({
                productId: new mongoose_2.Types.ObjectId(item.productId),
                name: item.name || 'Product',
                variantSku: item.variantSku,
                quantity: item.quantity || 1,
                notes: item.notes,
            }))
            : [];
        const issue = new this.issueModel({
            issueNumber,
            orderId: new mongoose_2.Types.ObjectId(dto.orderId),
            userId: new mongoose_2.Types.ObjectId(userId),
            type: dto.type,
            subject: dto.subject.trim(),
            description: dto.description.trim(),
            priority: dto.priority || issue_schema_1.IssuePriority.MEDIUM,
            status: issue_schema_1.IssueStatus.OPEN,
            items,
            attachments: dto.attachments || [],
            timeline: [
                {
                    action: 'ISSUE_CREATED',
                    actorType: 'CUSTOMER',
                    actorId: new mongoose_2.Types.ObjectId(userId),
                    notes: 'Customer submitted an issue report',
                    createdAt: new Date(),
                },
            ],
        });
        return (await issue.save());
    }
    async findAllByUser(userId, query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (query.orderId) {
            filter.orderId = new mongoose_2.Types.ObjectId(query.orderId);
        }
        if (query.status) {
            filter.status = query.status;
        }
        const [data, total] = await Promise.all([
            this.issueModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('orderId', 'orderId status placedAt deliveredAt totalAmount items')
                .exec(),
            this.issueModel.countDocuments(filter),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }
    async findAllAdmin(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = {};
        if (query.status) {
            filter.status = query.status;
        }
        if (query.type) {
            filter.type = query.type;
        }
        if (query.priority) {
            filter.priority = query.priority;
        }
        if (query.orderId) {
            filter.orderId = new mongoose_2.Types.ObjectId(query.orderId);
        }
        if (query.search && query.search.trim()) {
            const searchRegex = new RegExp(query.search.trim(), 'i');
            filter.$or = [
                { issueNumber: searchRegex },
                { subject: searchRegex },
                { description: searchRegex },
            ];
        }
        const sortField = query.sortBy || 'createdAt';
        const sortDir = query.sortOrder === 'asc' ? 1 : -1;
        const sortObj = { [sortField]: sortDir };
        const [data, total] = await Promise.all([
            this.issueModel
                .find(filter)
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .populate('userId', 'fullName email phoneNumber avatar')
                .populate('orderId', 'orderId status placedAt deliveredAt totalAmount')
                .populate('resolvedBy', 'fullName email')
                .exec(),
            this.issueModel.countDocuments(filter),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }
    async findById(id, userId) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid issue ID');
        }
        const query = { _id: id };
        if (userId) {
            query.userId = new mongoose_2.Types.ObjectId(userId);
        }
        const issue = await this.issueModel
            .findOne(query)
            .populate('userId', 'fullName email phoneNumber avatar')
            .populate('orderId', 'orderId status placedAt deliveredAt totalAmount items shippingAddress')
            .populate('resolvedBy', 'fullName email')
            .exec();
        if (!issue) {
            throw new common_1.NotFoundException('Issue not found');
        }
        return issue;
    }
    async updateStatus(id, adminId, dto) {
        const issue = await this.issueModel.findById(id);
        if (!issue) {
            throw new common_1.NotFoundException('Issue not found');
        }
        issue.status = dto.status;
        issue.timeline.push({
            action: `STATUS_${dto.status}`,
            actorType: 'ADMIN',
            actorId: new mongoose_2.Types.ObjectId(adminId),
            notes: dto.notes || `Status changed to ${dto.status}`,
            createdAt: new Date(),
        });
        return (await issue.save());
    }
    async resolveIssue(id, adminId, dto) {
        const issue = await this.issueModel.findById(id);
        if (!issue) {
            throw new common_1.NotFoundException('Issue not found');
        }
        issue.status = issue_schema_1.IssueStatus.RESOLVED;
        issue.resolutionNotes = dto.resolutionNotes.trim();
        issue.resolutionAction = dto.resolutionAction;
        issue.resolvedBy = new mongoose_2.Types.ObjectId(adminId);
        issue.resolvedAt = new Date();
        if (dto.internalNotes) {
            issue.adminNotes = issue.adminNotes
                ? `${issue.adminNotes}\n${dto.internalNotes.trim()}`
                : dto.internalNotes.trim();
        }
        issue.timeline.push({
            action: 'ISSUE_RESOLVED',
            actorType: 'ADMIN',
            actorId: new mongoose_2.Types.ObjectId(adminId),
            notes: `Issue resolved: ${dto.resolutionNotes}`,
            createdAt: new Date(),
        });
        return (await issue.save());
    }
    async addNote(id, adminId, dto) {
        const issue = await this.issueModel.findById(id);
        if (!issue) {
            throw new common_1.NotFoundException('Issue not found');
        }
        issue.adminNotes = issue.adminNotes
            ? `${issue.adminNotes}\n[${new Date().toISOString()}] ${dto.notes.trim()}`
            : `[${new Date().toISOString()}] ${dto.notes.trim()}`;
        issue.timeline.push({
            action: 'NOTE_ADDED',
            actorType: 'ADMIN',
            actorId: new mongoose_2.Types.ObjectId(adminId),
            notes: dto.notes.trim(),
            createdAt: new Date(),
        });
        return (await issue.save());
    }
};
exports.IssueService = IssueService;
exports.IssueService = IssueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(issue_schema_1.Issue.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], IssueService);
//# sourceMappingURL=issue.service.js.map