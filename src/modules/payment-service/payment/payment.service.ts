import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { paginateOptions } from 'src/common/constants';
import { IPaginatedResponse, PaymentStatus } from 'src/common/interface';
import { paginationHelpers, pick } from 'src/utils/helpers';
import { getPaginatedData } from 'src/utils/mongodb/getPaginatedData';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentQueryOptions } from './dto/payment.query-options.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import {
  AVAILABLE_PAYMENT_METHODS,
  PaymentCategoryConfig,
} from './payment-methods.config';
import { paymentSearchableFields } from './payment.constants';
import {
  PaymentCompletedEvent,
  PaymentEvents,
  PaymentFailedEvent,
  RefundInitiatedEvent,
} from './payment.events';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { PaymentUtils } from './utils/payment.utils';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * 1. Core Transaction Lifecycle: Initiate Payment
   */
  async initiatePayment(dto: InitiatePaymentDto): Promise<PaymentDocument> {
    const {
      userId,
      orderId,
      amount,
      paymentMethod,
      paymentProvider,
      currency,
      metadata,
    } = dto;

    const transactionId = PaymentUtils.generateTransactionId();

    const payment = new this.paymentModel({
      userId: new Types.ObjectId(userId),
      orderId: new Types.ObjectId(orderId),
      transactionId,
      amount,
      currency: currency || 'BDT',
      paymentMethod,
      paymentProvider,
      status: PaymentStatus.PENDING,
      metadata,
    });

    try {
      const savedPayment = await payment.save();
      // Logic to communicate with the payment gateway would go here.
      return savedPayment;
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Failed to initiate payment: ' + error.message,
      );
    }
  }

  /**
   * 1. Core Transaction Lifecycle: Verify Payment
   */
  async verifyPayment(transactionId: string): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findOne({ transactionId });
    if (!payment) {
      throw new NotFoundException('Payment transaction not found');
    }

    if (payment.status === PaymentStatus.PENDING) {
      // Stub: Call gateway API to check status if PENDING
    }

    return payment;
  }

  /**
   * 1. Core Transaction Lifecycle: Process Success
   */
  async processPaymentSuccess(
    transactionId: string,
    gatewayResponse: Record<string, any>,
  ): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findOne({ transactionId });
    if (!payment) {
      throw new NotFoundException('Payment transaction not found');
    }

    if (
      payment.status === PaymentStatus.PAID ||
      payment.status === PaymentStatus.SUCCESS
    ) {
      return payment;
    }

    payment.status = PaymentStatus.PAID;
    payment.paidAt = new Date();
    payment.gatewayResponse = gatewayResponse;
    if (gatewayResponse.gatewayTransactionId) {
      payment.gatewayTransactionId = gatewayResponse.gatewayTransactionId;
    }

    try {
      const updatedPayment = await payment.save();

      this.eventEmitter.emit(
        PaymentEvents.PAYMENT_COMPLETED,
        new PaymentCompletedEvent(
          (updatedPayment as any)._id.toString(),
          updatedPayment.transactionId,
          updatedPayment.orderId.toString(),
          updatedPayment.userId.toString(),
          updatedPayment.amount,
          updatedPayment.paymentMethod,
          updatedPayment.paymentProvider,
          updatedPayment.paidAt!,
        ),
      );

      return updatedPayment;
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Failed to process payment success: ' + error.message,
      );
    }
  }

  /**
   * 1. Core Transaction Lifecycle: Process Failure
   */
  async processPaymentFailure(
    transactionId: string,
    reason: string,
  ): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findOne({ transactionId });
    if (!payment) {
      throw new NotFoundException('Payment transaction not found');
    }

    if (
      payment.status === PaymentStatus.PAID ||
      payment.status === PaymentStatus.SUCCESS
    ) {
      return payment;
    }

    payment.status = PaymentStatus.FAILED;
    payment.failureReason = reason;

    try {
      const updatedPayment = await payment.save();

      this.eventEmitter.emit(
        PaymentEvents.PAYMENT_FAILED,
        new PaymentFailedEvent(
          (updatedPayment as any)._id.toString(),
          updatedPayment.transactionId,
          updatedPayment.orderId.toString(),
          updatedPayment.userId.toString(),
          reason,
        ),
      );

      return updatedPayment;
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Failed to process payment failure: ' + error.message,
      );
    }
  }

  /**
   * 2. Gateway Handlers: SSLCommerz Callback
   */
  async handleSSLCommerzCallback(payload: Record<string, any>): Promise<void> {
    // Ideally validate signature here
    const transactionId = payload.tran_id;
    if (!transactionId) {
      throw new BadRequestException('Invalid SSLCommerz payload');
    }

    if (payload.status === 'VALID') {
      await this.processPaymentSuccess(transactionId, payload);
    } else {
      await this.processPaymentFailure(
        transactionId,
        payload.failed_reason || 'Gateway Failed',
      );
    }
  }

  /**
   * 3. Public/Customer APIs: Get My Payments
   */
  async getMyPayments(
    userId: string,
    query: PaymentQueryOptions,
  ): Promise<IPaginatedResponse<PaymentDocument>> {
    const { limit, page, skip, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(query);

    const match: FilterQuery<PaymentDocument> = {
      userId: new Types.ObjectId(userId),
    };

    if (query.status) match.status = query.status;
    if (query.paymentMethod) match.paymentMethod = query.paymentMethod;
    if (query.transactionId) match.transactionId = query.transactionId;
    if (query.startDate && query.endDate) {
      match.createdAt = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate),
      };
    }

    const result = await this.paymentModel
      .find(match)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.paymentModel.countDocuments(match);

    return {
      data: result,
      meta: {
        page,
        limit,
        totalCount: total,
        totalPages: Math.ceil(total / limit),
        nextPage: page * limit < total ? page + 1 : null,
      },
    };
  }

  /**
   * 3. Public/Customer APIs: Get Payment By Transaction ID
   */
  async getPaymentByTransactionId(
    transactionId: string,
    userId: string,
  ): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findOne({
      transactionId,
      userId: new Types.ObjectId(userId),
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  /**
   * 4. Admin Panel APIs: Find All Payments
   */
  async findAll(
    query: PaymentQueryOptions,
  ): Promise<IPaginatedResponse<PaymentDocument>> {
    const paginateQueries = pick(query, paginateOptions);
    const { searchTerm, startDate, endDate, ...remainingFilters } = query;

    const filterQuery: FilterQuery<PaymentDocument> = {};

    if (searchTerm) {
      filterQuery['$or'] = paymentSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      }));
    }

    const andConditions: FilterQuery<PaymentDocument>[] = [];

    if (Object.keys(remainingFilters).length) {
      Object.entries(remainingFilters).forEach(([key, value]) => {
        if (key === 'orderId') {
          andConditions.push({ [key]: new Types.ObjectId(value as string) });
        } else {
          andConditions.push({ [key]: value });
        }
      });
    }

    if (startDate && endDate) {
      andConditions.push({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      });
    }

    if (andConditions.length > 0) {
      filterQuery['$and'] = andConditions;
    }

    const pagination = paginationHelpers.calculatePagination(paginateQueries);

    return await getPaginatedData<PaymentDocument>({
      model: this.paymentModel,
      paginationQuery: pagination,
      filterQuery,
    });
  }

  async findOne(id: string): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findById(id);

    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async getPaymentStats() {
    const stats = await this.paymentModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);
    return stats;
  }

  async manualUpdateStatus(
    id: string,
    dto: UpdatePaymentStatusDto,
  ): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findById(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    payment.status = dto.status;
    payment.metadata = {
      ...payment.metadata,
      manualUpdateReason: dto.reason,
      updatedAt: new Date(),
    };

    if (dto.status === PaymentStatus.PAID && !payment.paidAt) {
      payment.paidAt = new Date();
    }

    return await payment.save();
  }

  async initiateRefund(
    paymentId: string,
    amount: number,
    reason: string,
  ): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) throw new NotFoundException('Payment not found');

    if (payment.status !== PaymentStatus.PAID) {
      throw new BadRequestException('Can only refund PAID transactions');
    }

    // Stub: Call Gateway Refund API here

    payment.status = PaymentStatus.REFUNDED;
    payment.refundedAt = new Date();
    payment.metadata = {
      ...payment.metadata,
      refundReason: reason,
      refundAmount: amount,
    };

    const updatedPayment = await payment.save();

    this.eventEmitter.emit(
      PaymentEvents.REFUND_INITIATED,
      new RefundInitiatedEvent(
        (updatedPayment as any)._id.toString(),
        updatedPayment.transactionId,
        updatedPayment.orderId.toString(),
        amount,
        reason,
      ),
    );

    return updatedPayment;
  }

  getAvailablePaymentMethods(): PaymentCategoryConfig[] {
    return AVAILABLE_PAYMENT_METHODS;
  }
}
