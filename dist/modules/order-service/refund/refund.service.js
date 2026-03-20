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
exports.RefundService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../../common/constants");
const media_events_1 = require("../../../common/events/media.events");
const helpers_1 = require("../../../utils/helpers");
const media_helper_1 = require("../../../utils/helpers/media-helper");
const getPaginatedData_1 = require("../../../utils/mongodb/getPaginatedData");
const order_schema_1 = require("../order/schemas/order.schema");
const refund_constants_1 = require("./constants/refund.constants");
const refund_helpers_1 = require("./refund.helpers");
const refund_schema_1 = require("./schemas/refund.schema");
let RefundService = class RefundService {
    refundModel;
    orderModel;
    eventEmitter;
    connection;
    constructor(refundModel, orderModel, eventEmitter, connection) {
        this.refundModel = refundModel;
        this.orderModel = orderModel;
        this.eventEmitter = eventEmitter;
        this.connection = connection;
    }
    async createRefundRequest(userId, dto) {
        const order = await (0, refund_helpers_1.validateOrderOwnership)(this.orderModel, dto.orderId, userId);
        (0, refund_helpers_1.validateRefundEligibility)(order);
        await (0, refund_helpers_1.checkExistingRefund)(this.refundModel, order._id);
        if (dto.refundType === refund_schema_1.RefundType.PARTIAL) {
            if (!dto.items || dto.items.length === 0) {
                throw new common_1.BadRequestException('Items are required for partial refunds');
            }
            (0, refund_helpers_1.validateRefundItems)(dto.items, order);
        }
        (0, refund_helpers_1.checkEvidenceRequirements)(dto);
        await (0, refund_helpers_1.checkUserRefundLimits)(this.refundModel, userId);
        const refundAmount = (0, refund_helpers_1.calculateRefundAmount)(order, dto);
        const refundId = await (0, refund_helpers_1.generateUniqueRefundId)(this.refundModel);
        const refund = new this.refundModel({
            refundId,
            orderId: order._id,
            orderNumber: order.orderId,
            userId: new mongoose_2.Types.ObjectId(userId),
            refundType: dto.refundType,
            status: refund_schema_1.RefundStatus.PENDING_APPROVAL,
            reason: dto.reason,
            reasonDetails: dto.reasonDetails,
            items: dto.refundType === refund_schema_1.RefundType.PARTIAL ? dto.items : [],
            refundAmount,
            refundMethod: dto.refundMethod || refund_schema_1.RefundMethod.ORIGINAL_PAYMENT,
            evidence: dto.evidence,
            timeline: {
                requestedAt: new Date(),
            },
        });
        const savedRefund = await refund.save();
        const refundIdStr = savedRefund._id.toString();
        if (savedRefund.evidence) {
            if (savedRefund.evidence.images &&
                savedRefund.evidence.images.length > 0) {
                savedRefund.evidence.images.forEach((url) => {
                    const mediaId = (0, media_helper_1.extractMediaIdFromUrl)(url);
                    if (mediaId) {
                        this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_ATTACHED, new media_events_1.ImageAttachedEvent(mediaId, refundIdStr, 'refund'));
                    }
                });
            }
            if (savedRefund.evidence.videos &&
                savedRefund.evidence.videos.length > 0) {
                savedRefund.evidence.videos.forEach((url) => {
                    const mediaId = (0, media_helper_1.extractMediaIdFromUrl)(url);
                    if (mediaId) {
                        this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_ATTACHED, new media_events_1.ImageAttachedEvent(mediaId, refundIdStr, 'refund'));
                    }
                });
            }
        }
        await this.orderModel.findByIdAndUpdate(order._id, {
            hasRefund: true,
            $push: { refundIds: savedRefund._id },
        });
        this.eventEmitter.emit(refund_constants_1.REFUND_NOTIFICATION_EVENTS.REFUND_REQUESTED, {
            refundId: savedRefund.refundId,
            userId,
            orderId: order.orderId,
            amount: refundAmount.totalRefundAmount,
        });
        return savedRefund;
    }
    async findAll(query) {
        const paginateQueries = (0, helpers_1.pick)(query, constants_1.paginateOptions);
        const { searchTerm, ...remainingFilters } = query;
        const filterQuery = {};
        if (searchTerm) {
            filterQuery['$or'] = [
                { refundId: { $regex: searchTerm, $options: 'i' } },
                { orderNumber: { $regex: searchTerm, $options: 'i' } },
            ];
        }
        if (Object.keys(remainingFilters).length) {
            filterQuery['$and'] = Object.entries(remainingFilters).map(([key, value]) => ({
                [key]: value,
            }));
        }
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.refundModel,
            paginationQuery: pagination,
            filterQuery,
        });
    }
    async findAllByUser(userId, query) {
        return this.findAll({ ...query, userId });
    }
    async findById(refundId, userId) {
        const refund = await this.refundModel.findById(refundId);
        if (!refund) {
            throw new common_1.NotFoundException(refund_constants_1.REFUND_ERROR_MESSAGES.REFUND_NOT_FOUND);
        }
        if (userId && refund.userId.toString() !== userId) {
            throw new common_1.UnauthorizedException(refund_constants_1.REFUND_ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
        }
        return refund;
    }
    async cancelRefund(refundId, userId, dto) {
        const refund = await this.findById(refundId, userId);
        if (![refund_schema_1.RefundStatus.REQUESTED, refund_schema_1.RefundStatus.PENDING_APPROVAL].includes(refund.status)) {
            throw new common_1.BadRequestException('Cannot cancel refund in current status');
        }
        refund.status = refund_schema_1.RefundStatus.CANCELLED;
        refund.timeline.cancelledAt = new Date();
        if (dto.cancellationReason) {
            refund.internalNotes = `Cancellation: ${dto.cancellationReason}`;
        }
        const updated = await refund.save();
        this.eventEmitter.emit(refund_constants_1.REFUND_NOTIFICATION_EVENTS.REFUND_CANCELLED, {
            refundId: refund.refundId,
            userId,
        });
        return updated;
    }
    async approveOrReject(refundId, adminId, dto) {
        const refund = await this.refundModel.findById(refundId);
        if (!refund) {
            throw new common_1.NotFoundException(refund_constants_1.REFUND_ERROR_MESSAGES.REFUND_NOT_FOUND);
        }
        if (refund.status !== refund_schema_1.RefundStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Refund is not pending approval');
        }
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            if (dto.action === 'APPROVE') {
                refund.status = refund_schema_1.RefundStatus.APPROVED;
                refund.timeline.approvedAt = new Date();
                if (dto.restoreStock && (0, refund_helpers_1.shouldRestoreStock)(refund.reason)) {
                    this.emitStockRestoreEvent(refund);
                    refund.isStockRestored = true;
                    refund.stockRestoredAt = new Date();
                }
                if (dto.restoreCoupon && refund.refundType === refund_schema_1.RefundType.FULL) {
                    await this.emitCouponRestoreEvent(refund);
                    refund.isCouponRestored = true;
                    refund.couponRestoredAt = new Date();
                }
                this.eventEmitter.emit(refund_constants_1.REFUND_NOTIFICATION_EVENTS.REFUND_APPROVED, {
                    refundId: refund.refundId,
                    userId: refund.userId.toString(),
                    amount: refund.refundAmount.totalRefundAmount,
                });
            }
            else {
                if (!dto.rejectionReason) {
                    throw new common_1.BadRequestException('Rejection reason is required');
                }
                refund.status = refund_schema_1.RefundStatus.REJECTED;
                refund.timeline.rejectedAt = new Date();
                refund.rejectionReason = dto.rejectionReason;
                this.eventEmitter.emit(refund_constants_1.REFUND_NOTIFICATION_EVENTS.REFUND_REJECTED, {
                    refundId: refund.refundId,
                    userId: refund.userId.toString(),
                    reason: dto.rejectionReason,
                });
            }
            const adminAction = {
                adminId: new mongoose_2.Types.ObjectId(adminId),
                action: dto.action,
                note: dto.note || '',
                timestamp: new Date(),
            };
            refund.adminActions.push(adminAction);
            const updated = await refund.save({ session: session });
            await session.commitTransaction();
            return updated;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async processRefundPayment(refundId, adminId, dto) {
        const refund = await this.refundModel.findById(refundId);
        if (!refund) {
            throw new common_1.NotFoundException(refund_constants_1.REFUND_ERROR_MESSAGES.REFUND_NOT_FOUND);
        }
        if (refund.status !== refund_schema_1.RefundStatus.APPROVED) {
            throw new common_1.BadRequestException('Refund must be approved before processing');
        }
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            if (dto.processingFee)
                refund.refundAmount.processingFee = dto.processingFee;
            if (dto.restockingFee)
                refund.refundAmount.restockingFee = dto.restockingFee;
            refund.refundAmount.totalRefundAmount = (0, refund_helpers_1.calculateTotalRefundAmount)(refund.refundAmount);
            refund.status = refund_schema_1.RefundStatus.PROCESSING;
            refund.timeline.processingStartedAt = new Date();
            const adminAction = {
                adminId: new mongoose_2.Types.ObjectId(adminId),
                action: 'PROCESSING',
                note: dto.note || '',
                timestamp: new Date(),
            };
            refund.adminActions.push(adminAction);
            await refund.save({ session: session });
            this.eventEmitter.emit(refund_constants_1.REFUND_NOTIFICATION_EVENTS.REFUND_PROCESSING, {
                refundId: refund.refundId,
                userId: refund.userId.toString(),
                amount: refund.refundAmount.totalRefundAmount,
                method: refund.refundMethod,
            });
            const paymentResult = await this.processPaymentGateway(refund);
            if (paymentResult.success) {
                refund.status = refund_schema_1.RefundStatus.COMPLETED;
                refund.timeline.completedAt = new Date();
                refund.paymentGatewayResponse = paymentResult.gatewayResponse;
                await this.updateOrderAfterRefund(refund, session);
                this.eventEmitter.emit(refund_constants_1.REFUND_NOTIFICATION_EVENTS.REFUND_COMPLETED, {
                    refundId: refund.refundId,
                    userId: refund.userId.toString(),
                    amount: refund.refundAmount.totalRefundAmount,
                });
            }
            else {
                refund.status = refund_schema_1.RefundStatus.FAILED;
                refund.timeline.failedAt = new Date();
                refund.failureReason = paymentResult.error || 'Unknown payment error';
                refund.paymentGatewayResponse = paymentResult.gatewayResponse;
                this.eventEmitter.emit(refund_constants_1.REFUND_NOTIFICATION_EVENTS.REFUND_FAILED, {
                    refundId: refund.refundId,
                    userId: refund.userId.toString(),
                    error: paymentResult.error || 'Unknown error',
                });
            }
            const updated = await refund.save({ session: session });
            await session.commitTransaction();
            return updated;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async updateRefundStatus(refundId, adminId, dto) {
        const refund = await this.refundModel.findById(refundId);
        if (!refund) {
            throw new common_1.NotFoundException(refund_constants_1.REFUND_ERROR_MESSAGES.REFUND_NOT_FOUND);
        }
        if (!(0, refund_constants_1.isValidStatusTransition)(refund.status, dto.status)) {
            throw new common_1.BadRequestException(refund_constants_1.REFUND_ERROR_MESSAGES.INVALID_STATUS_TRANSITION);
        }
        const oldStatus = refund.status;
        refund.status = dto.status;
        const now = new Date();
        switch (dto.status) {
            case refund_schema_1.RefundStatus.APPROVED:
                refund.timeline.approvedAt = now;
                break;
            case refund_schema_1.RefundStatus.REJECTED:
                refund.timeline.rejectedAt = now;
                if (dto.note)
                    refund.rejectionReason = dto.note;
                break;
            case refund_schema_1.RefundStatus.PROCESSING:
                refund.timeline.processingStartedAt = now;
                break;
            case refund_schema_1.RefundStatus.COMPLETED:
                refund.timeline.completedAt = now;
                break;
            case refund_schema_1.RefundStatus.FAILED:
                refund.timeline.failedAt = now;
                if (dto.failureReason)
                    refund.failureReason = dto.failureReason;
                break;
            case refund_schema_1.RefundStatus.CANCELLED:
                refund.timeline.cancelledAt = now;
                break;
        }
        const adminAction = {
            adminId: new mongoose_2.Types.ObjectId(adminId),
            action: `STATUS_${oldStatus}_TO_${dto.status}`,
            note: dto.note || '',
            timestamp: now,
        };
        refund.adminActions.push(adminAction);
        return await refund.save();
    }
    async addInternalNote(refundId, adminId, dto) {
        const refund = await this.refundModel.findById(refundId);
        if (!refund) {
            throw new common_1.NotFoundException(refund_constants_1.REFUND_ERROR_MESSAGES.REFUND_NOT_FOUND);
        }
        const timestamp = new Date().toISOString();
        const newNote = `[${timestamp}] Admin ${adminId}: ${dto.note}`;
        refund.internalNotes = refund.internalNotes
            ? `${refund.internalNotes}\n${newNote}`
            : newNote;
        const adminAction = {
            adminId: new mongoose_2.Types.ObjectId(adminId),
            action: 'NOTE_ADDED',
            note: dto.note,
            timestamp: new Date(),
        };
        refund.adminActions.push(adminAction);
        return await refund.save();
    }
    emitStockRestoreEvent(refund) {
        this.eventEmitter.emit('refund.stock.restore', {
            refundId: refund.refundId,
            items: refund.items,
            isSellable: (0, refund_helpers_1.isStockSellable)(refund.reason),
            isDamaged: (0, refund_helpers_1.isStockDamaged)(refund.reason),
        });
    }
    async emitCouponRestoreEvent(refund) {
        const order = await this.orderModel.findById(refund.orderId);
        if (order?.billingInfo.appliedCouponId) {
            this.eventEmitter.emit('refund.coupon.restore', {
                refundId: refund.refundId,
                couponId: order.billingInfo.appliedCouponId,
                userId: refund.userId.toString(),
            });
        }
    }
    async processPaymentGateway(refund) {
        try {
            if (refund.refundMethod === refund_schema_1.RefundMethod.WALLET) {
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
        }
        catch (error) {
            const err = error;
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
    async updateOrderAfterRefund(refund, session) {
        const order = await this.orderModel
            .findById(refund.orderId)
            .session(session);
        if (!order)
            return;
        order.totalRefundedAmount += refund.refundAmount.totalRefundAmount;
        if (refund.refundType === refund_schema_1.RefundType.FULL) {
            order.status = order_schema_1.OrderStatus.REFUNDED;
            order.billingInfo.paymentStatus = order_schema_1.PaymentStatus.REFUNDED;
        }
        await order.save();
    }
};
exports.RefundService = RefundService;
exports.RefundService = RefundService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(refund_schema_1.Refund.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(3, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        event_emitter_1.EventEmitter2,
        mongoose_2.Connection])
], RefundService);
//# sourceMappingURL=refund.service.js.map