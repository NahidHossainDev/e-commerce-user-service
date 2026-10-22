import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../order/schemas/order.schema';
import {
  AddIssueNoteDto,
  CreateIssueDto,
  IssueQueryOptionsDto,
  ResolveIssueDto,
  UpdateIssueStatusDto,
} from './dto/issue.dto';
import {
  Issue,
  IssueDocument,
  IssuePriority,
  IssueStatus,
} from './schemas/issue.schema';

@Injectable()
export class IssueService {
  constructor(
    @InjectModel(Issue.name) private readonly issueModel: Model<IssueDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  private generateIssueNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    return `ISS-${dateStr}-${randomHex}`;
  }

  async createIssue(userId: string, dto: CreateIssueDto): Promise<Issue> {
    const order = await this.orderModel.findById(dto.orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const orderUserId = (order.userId as any)?._id || order.userId;
    if (orderUserId && orderUserId.toString() !== userId.toString()) {
      throw new UnauthorizedException('You can only report issues for your own orders');
    }

    const issueNumber = this.generateIssueNumber();

    const items =
      dto.items && dto.items.length > 0
        ? dto.items.map((item) => ({
            productId: new Types.ObjectId(item.productId),
            name: item.name || 'Product',
            variantSku: item.variantSku,
            quantity: item.quantity || 1,
            notes: item.notes,
          }))
        : [];

    const issue = new this.issueModel({
      issueNumber,
      orderId: new Types.ObjectId(dto.orderId),
      userId: new Types.ObjectId(userId),
      type: dto.type,
      subject: dto.subject.trim(),
      description: dto.description.trim(),
      priority: dto.priority || IssuePriority.MEDIUM,
      status: IssueStatus.OPEN,
      items,
      attachments: dto.attachments || [],
      timeline: [
        {
          action: 'ISSUE_CREATED',
          actorType: 'CUSTOMER',
          actorId: new Types.ObjectId(userId),
          notes: 'Customer submitted an issue report',
          createdAt: new Date(),
        },
      ],
    });

    return (await issue.save()) as Issue;
  }

  async findAllByUser(
    userId: string,
    query: IssueQueryOptionsDto,
  ): Promise<{ data: Issue[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { userId: new Types.ObjectId(userId) };
    if (query.orderId) {
      filter.orderId = new Types.ObjectId(query.orderId);
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

  async findAllAdmin(
    query: IssueQueryOptionsDto,
  ): Promise<{ data: Issue[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

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
      filter.orderId = new Types.ObjectId(query.orderId);
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
    const sortObj: any = { [sortField]: sortDir };

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

  async findById(id: string, userId?: string): Promise<Issue> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid issue ID');
    }

    const query: any = { _id: id };
    if (userId) {
      query.userId = new Types.ObjectId(userId);
    }

    const issue = await this.issueModel
      .findOne(query)
      .populate('userId', 'fullName email phoneNumber avatar')
      .populate('orderId', 'orderId status placedAt deliveredAt totalAmount items shippingAddress')
      .populate('resolvedBy', 'fullName email')
      .exec();

    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    return issue;
  }

  async updateStatus(
    id: string,
    adminId: string,
    dto: UpdateIssueStatusDto,
  ): Promise<Issue> {
    const issue = await this.issueModel.findById(id);
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    issue.status = dto.status;
    issue.timeline.push({
      action: `STATUS_${dto.status}`,
      actorType: 'ADMIN',
      actorId: new Types.ObjectId(adminId),
      notes: dto.notes || `Status changed to ${dto.status}`,
      createdAt: new Date(),
    });

    return (await issue.save()) as Issue;
  }

  async resolveIssue(
    id: string,
    adminId: string,
    dto: ResolveIssueDto,
  ): Promise<Issue> {
    const issue = await this.issueModel.findById(id);
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    issue.status = IssueStatus.RESOLVED;
    issue.resolutionNotes = dto.resolutionNotes.trim();
    issue.resolutionAction = dto.resolutionAction;
    issue.resolvedBy = new Types.ObjectId(adminId);
    issue.resolvedAt = new Date();

    if (dto.internalNotes) {
      issue.adminNotes = issue.adminNotes
        ? `${issue.adminNotes}\n${dto.internalNotes.trim()}`
        : dto.internalNotes.trim();
    }

    issue.timeline.push({
      action: 'ISSUE_RESOLVED',
      actorType: 'ADMIN',
      actorId: new Types.ObjectId(adminId),
      notes: `Issue resolved: ${dto.resolutionNotes}`,
      createdAt: new Date(),
    });

    return (await issue.save()) as Issue;
  }

  async addNote(id: string, adminId: string, dto: AddIssueNoteDto): Promise<Issue> {
    const issue = await this.issueModel.findById(id);
    if (!issue) {
      throw new NotFoundException('Issue not found');
    }

    issue.adminNotes = issue.adminNotes
      ? `${issue.adminNotes}\n[${new Date().toISOString()}] ${dto.notes.trim()}`
      : `[${new Date().toISOString()}] ${dto.notes.trim()}`;

    issue.timeline.push({
      action: 'NOTE_ADDED',
      actorType: 'ADMIN',
      actorId: new Types.ObjectId(adminId),
      notes: dto.notes.trim(),
      createdAt: new Date(),
    });

    return (await issue.save()) as Issue;
  }
}
