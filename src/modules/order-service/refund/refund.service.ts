import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { paginateOptions } from 'src/common/constants';
import { IPaginatedResponse } from 'src/common/interface';
import { paginationHelpers, pick } from 'src/utils/helpers';
import { getPaginatedData } from 'src/utils/mongodb/getPaginatedData';
import { Order, OrderDocument } from '../order/schemas/order.schema';
import {
  isValidStatusTransition,
  REFUND_ERROR_MESSAGES,
  REFUND_NOTIFICATION_EVENTS,
} from './constants/refund.constants';
import {
  AddRefundNoteDto,
  AdminRefundActionDto,
  CancelRefundRequestDto,
  CreateRefundRequestDto,
  ProcessRefundDto,
  UpdateRefundStatusDto,
} from './dto/refund.dto';
import { RefundQueryOptions } from './dto/refund.query-options.dto';
import {
  calculateRefundAmount,
  calculateTotalRefundAmount,
  checkEvidenceRequirements,
  checkExistingRefund,
  checkUserRefundLimits,
  generateUniqueRefundId,
  isStockDamaged,
  isStockSellable,
  shouldRestoreStock,
  validateOrderOwnership,
  validateRefundEligibility,
  validateRefundItems,
} from './refund.helpers';
import {
  AdminAction,
  Refund,
  RefundDocument,
  RefundMethod,
  RefundStatus,
  RefundType,
} from './schemas/refund.schema';

@Injectable()
export class RefundService {
  constructor(
    @InjectModel(Refund.name) private refundModel: Model<RefundDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly eventEmitter: EventEmitter2,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createRefundRequest(
    userId: string,
    dto: CreateRefundRequestDto,
  ): Promise<RefundDocument> {
    const order = await validateOrderOwnership(
      this.orderModel,
      dto.orderId,
      userId,
    );

    validateRefundEligibility(order);
    await checkExistingRefund(this.refundModel, order._id as Types.ObjectId);

    if (dto.refundType === RefundType.PARTIAL) {
      if (!dto.items || dto.items.length === 0) {
        throw new BadRequestException('Items are required for partial refunds');
      }
      validateRefundItems(dto.items, order);
    }

    checkEvidenceRequirements(dto);
    await checkUserRefundLimits(this.refundModel, userId);

    const refundAmount = calculateRefundAmount(order, dto);
    const refundId = await generateUniqueRefundId(this.refundModel);

    const refund = new this.refundModel({
      refundId,
      orderId: order._id,
      orderNumber: order.orderId,
      userId: new Types.ObjectId(userId),
      refundType: dto.refundType,
      status: RefundStatus.PENDING_APPROVAL,
      reason: dto.reason,
      reasonDetails: dto.reasonDetails,
      items: dto.refundType === RefundType.PARTIAL ? dto.items : [],
      refundAmount,
      refundMethod: dto.refundMethod || RefundMethod.ORIGINAL_PAYMENT,
      evidence: dto.evidence,
      timeline: {
        requestedAt: new Date(),
      },
    });

    const savedRefund = await refund.save();

    await this.orderModel.findByIdAndUpdate(order._id, {
      hasRefund: true,
      $push: { refundIds: savedRefund._id },
    });

    this.eventEmitter.emit(REFUND_NOTIFICATION_EVENTS.REFUND_REQUESTED, {
      refundId: savedRefund.refundId,
      userId,
      orderId: order.orderId,
      amount: refundAmount.totalRefundAmount,
    });

    return savedRefund;
  }

  async findAll(
    query: RefundQueryOptions,
  ): Promise<IPaginatedResponse<RefundDocument>> {
    const paginateQueries = pick(query, paginateOptions);
    const { searchTerm, ...remainingFilters } = query;

    const filterQuery: any = {};

    if (searchTerm) {
      filterQuery['$or'] = [
        { refundId: { $regex: searchTerm, $options: 'i' } },
        { orderNumber: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    if (Object.keys(remainingFilters).length) {
      filterQuery['$and'] = Object.entries(remainingFilters).map(
        ([key, value]) => ({
          [key]: value,
        }),
      );
    }

    const pagination = paginationHelpers.calculatePagination(paginateQueries);

    return await getPaginatedData<RefundDocument>({
      model: this.refundModel,
      paginationQuery: pagination,
      filterQuery,
    });
  }

  async findAllByUser(
    userId: string,
    query: RefundQueryOptions,
  ): Promise<IPaginatedResponse<RefundDocument>> {
    return this.findAll({ ...query, userId });
  }

  async findById(refundId: string, userId?: string): Promise<RefundDocument> {
    const refund = await this.refundModel.findById(refundId);
    if (!refund) {
      throw new NotFoundException(REFUND_ERROR_MESSAGES.REFUND_NOT_FOUND);
    }

    if (userId && refund.userId.toString() !== userId) {
      throw new UnauthorizedException(
        REFUND_ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
      );
    }

    return refund;
  }

  async cancelRefund(
    refundId: string,
    userId: string,
    dto: CancelRefundRequestDto,
  ): Promise<RefundDocument> {
    const refund = await this.findById(refundId, userId);

    if (
      ![RefundStatus.REQUESTED, RefundStatus.PENDING_APPROVAL].includes(
        refund.status as RefundStatus,
      )
    ) {
      throw new BadRequestException('Cannot cancel refund in current status');
    }

    refund.status = RefundStatus.CANCELLED;
    refund.timeline.cancelledAt = new Date();
    if (dto.cancellationReason) {
      refund.internalNotes = `Cancellation: ${dto.cancellationReason}`;
    }

    const updated = await refund.save();

    this.eventEmitter.emit(REFUND_NOTIFICATION_EVENTS.REFUND_CANCELLED, {
      refundId: refund.refundId,
      userId,
    });

    return updated;
  }

  async approveOrReject(
    refundId: string,
    adminId: string,
    dto: AdminRefundActionDto,
  ): Promise<RefundDocument> {
    const refund = await this.refundModel.findById(refundId);
    if (!refund) {
      throw new NotFoundException(REFUND_ERROR_MESSAGES.REFUND_NOT_FOUND);
    }

    if ((refund.status as RefundStatus) !== RefundStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Refund is not pending approval');
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      if (dto.action === 'APPROVE') {
        refund.status = RefundStatus.APPROVED;
        refund.timeline.approvedAt = new Date();

        if (dto.restoreStock && shouldRestoreStock(refund.reason as any)) {
          this.emitStockRestoreEvent(refund);
          refund.isStockRestored = true;
          refund.stockRestoredAt = new Date();
        }

        if (dto.restoreCoupon && refund.refundType === RefundType.FULL) {
          await this.emitCouponRestoreEvent(refund);
          refund.isCouponRestored = true;
          refund.couponRestoredAt = new Date();
        }

        this.eventEmitter.emit(REFUND_NOTIFICATION_EVENTS.REFUND_APPROVED, {
          refundId: refund.refundId,
          userId: refund.userId.toString(),
          amount: refund.refundAmount.totalRefundAmount,
        });
      } else {
        if (!dto.rejectionReason) {
          throw new BadRequestException('Rejection reason is required');
        }

        refund.status = RefundStatus.REJECTED;
        refund.timeline.rejectedAt = new Date();
        refund.rejectionReason = dto.rejectionReason;

        this.eventEmitter.emit(REFUND_NOTIFICATION_EVENTS.REFUND_REJECTED, {
          refundId: refund.refundId,
          userId: refund.userId.toString(),
          reason: dto.rejectionReason,
        });
      }

      const adminAction: Partial<AdminAction> = {
        adminId: new Types.ObjectId(adminId),
        action: dto.action,
        note: dto.note || '',
        timestamp: new Date(),
      };
      refund.adminActions.push(adminAction as AdminAction);

      const updated = await refund.save({ session: session as any });
      await session.commitTransaction();

      return updated;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async processRefundPayment(
    refundId: string,
    adminId: string,
    dto: ProcessRefundDto,
  ): Promise<RefundDocument> {
    const refund = await this.refundModel.findById(refundId);
    if (!refund) {
      throw new NotFoundException(REFUND_ERROR_MESSAGES.REFUND_NOT_FOUND);
    }

    if ((refund.status as RefundStatus) !== RefundStatus.APPROVED) {
      throw new BadRequestException(
        'Refund must be approved before processing',
      );
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      if (dto.processingFee)
        refund.refundAmount.processingFee = dto.processingFee;
      if (dto.restockingFee)
        refund.refundAmount.restockingFee = dto.restockingFee;

      refund.refundAmount.totalRefundAmount = calculateTotalRefundAmount(
        refund.refundAmount,
      );

      refund.status = RefundStatus.PROCESSING;
      refund.timeline.processingStartedAt = new Date();

      const adminAction: Partial<AdminAction> = {
        adminId: new Types.ObjectId(adminId),
        action: 'PROCESSING',
        note: dto.note || '',
        timestamp: new Date(),
      };
      refund.adminActions.push(adminAction as AdminAction);

      await refund.save({ session: session as any });

      this.eventEmitter.emit(REFUND_NOTIFICATION_EVENTS.REFUND_PROCESSING, {
        refundId: refund.refundId,
        userId: refund.userId.toString(),
        amount: refund.refundAmount.totalRefundAmount,
        method: refund.refundMethod,
      });

      const paymentResult = await this.processPaymentGateway(refund);

      if (paymentResult.success) {
        refund.status = RefundStatus.COMPLETED;
        refund.timeline.completedAt = new Date();
        refund.paymentGatewayResponse = paymentResult.gatewayResponse;

        await this.updateOrderAfterRefund(refund, session);

        this.eventEmitter.emit(REFUND_NOTIFICATION_EVENTS.REFUND_COMPLETED, {
          refundId: refund.refundId,
          userId: refund.userId.toString(),
          amount: refund.refundAmount.totalRefundAmount,
        });
      } else {
        refund.status = RefundStatus.FAILED;
        refund.timeline.failedAt = new Date();
        refund.failureReason = paymentResult.error || 'Unknown payment error';
        refund.paymentGatewayResponse = paymentResult.gatewayResponse;

        this.eventEmitter.emit(REFUND_NOTIFICATION_EVENTS.REFUND_FAILED, {
          refundId: refund.refundId,
          userId: refund.userId.toString(),
          error: paymentResult.error || 'Unknown error',
        });
      }

      const updated = await refund.save({ session: session as any });
      await session.commitTransaction();

      return updated;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updateRefundStatus(
    refundId: string,
    adminId: string,
    dto: UpdateRefundStatusDto,
  ): Promise<RefundDocument> {
    const refund = await this.refundModel.findById(refundId);
    if (!refund) {
      throw new NotFoundException(REFUND_ERROR_MESSAGES.REFUND_NOT_FOUND);
    }

    if (!isValidStatusTransition(refund.status, dto.status)) {
      throw new BadRequestException(
        REFUND_ERROR_MESSAGES.INVALID_STATUS_TRANSITION,
      );
    }

    const oldStatus = refund.status;
    refund.status = dto.status;

    const now = new Date();
    switch (dto.status) {
      case RefundStatus.APPROVED:
        refund.timeline.approvedAt = now;
        break;
      case RefundStatus.REJECTED:
        refund.timeline.rejectedAt = now;
        if (dto.note) refund.rejectionReason = dto.note;
        break;
      case RefundStatus.PROCESSING:
        refund.timeline.processingStartedAt = now;
        break;
      case RefundStatus.COMPLETED:
        refund.timeline.completedAt = now;
        break;
      case RefundStatus.FAILED:
        refund.timeline.failedAt = now;
        if (dto.failureReason) refund.failureReason = dto.failureReason;
        break;
      case RefundStatus.CANCELLED:
        refund.timeline.cancelledAt = now;
        break;
    }

    const adminAction: Partial<AdminAction> = {
      adminId: new Types.ObjectId(adminId),
      action: `STATUS_${oldStatus}_TO_${dto.status}`,
      note: dto.note || '',
      timestamp: now,
    };
    refund.adminActions.push(adminAction as AdminAction);

    return await refund.save();
  }

  async addInternalNote(
    refundId: string,
    adminId: string,
    dto: AddRefundNoteDto,
  ): Promise<RefundDocument> {
    const refund = await this.refundModel.findById(refundId);
    if (!refund) {
      throw new NotFoundException(REFUND_ERROR_MESSAGES.REFUND_NOT_FOUND);
    }

    const timestamp = new Date().toISOString();
    const newNote = `[${timestamp}] Admin ${adminId}: ${dto.note}`;
    refund.internalNotes = refund.internalNotes
      ? `${refund.internalNotes}\n${newNote}`
      : newNote;

    const adminAction: Partial<AdminAction> = {
      adminId: new Types.ObjectId(adminId),
      action: 'NOTE_ADDED',
      note: dto.note,
      timestamp: new Date(),
    };
    refund.adminActions.push(adminAction as AdminAction);

    return await refund.save();
  }

  private emitStockRestoreEvent(refund: RefundDocument): void {
    this.eventEmitter.emit('refund.stock.restore', {
      refundId: refund.refundId,
      items: refund.items,
      isSellable: isStockSellable(refund.reason as any),
      isDamaged: isStockDamaged(refund.reason as any),
    });
  }

  private async emitCouponRestoreEvent(refund: RefundDocument): Promise<void> {
    const order = await this.orderModel.findById(refund.orderId);
    if (order?.billingInfo.couponCode) {
      this.eventEmitter.emit('refund.coupon.restore', {
        refundId: refund.refundId,
        couponCode: order.billingInfo.couponCode,
        userId: refund.userId.toString(),
      });
    }
  }

  private async processPaymentGateway(
    refund: RefundDocument,
  ): Promise<{ success: boolean; error?: string; gatewayResponse?: any }> {
    try {
      if (refund.refundMethod === RefundMethod.WALLET) {
        this.eventEmitter.emit('refund.wallet.credit', {
          refundId: refund.refundId,
          userId: refund.userId.toString(),
          amount: refund.refundAmount.totalRefundAmount,
        });

        return {
          success: true,
          gatewayResponse: {
            gateway: 'wallet',
            status: 'completed',
            timestamp: new Date(),
          },
        };
      }

      return {
        success: true,
        gatewayResponse: {
          gateway: 'mock_gateway',
          transactionId: `txn_${Date.now()}`,
          refundId: `ref_${Date.now()}`,
          status: 'succeeded',
          rawResponse: {},
          timestamp: new Date(),
        },
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        error: err.message || 'Payment gateway error',
        gatewayResponse: {
          gateway: 'mock_gateway',
          status: 'failed',
          rawResponse: { error: err.message },
          timestamp: new Date(),
        },
      };
    }
  }

  private async updateOrderAfterRefund(
    refund: RefundDocument,
    session: ClientSession,
  ): Promise<void> {
    const order = await this.orderModel
      .findById(refund.orderId)
      .session(session);
    if (!order) return;

    order.totalRefundedAmount += refund.refundAmount.totalRefundAmount;

    if (refund.refundType === RefundType.FULL) {
      order.status = 'REFUNDED';
      order.billingInfo.paymentStatus = 'REFUNDED';
    }

    await order.save();
  }
}
