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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../../common/constants");
const interface_1 = require("../../../common/interface");
const helpers_1 = require("../../../utils/helpers");
const getPaginatedData_1 = require("../../../utils/mongodb/getPaginatedData");
const wallet_interface_1 = require("../wallet/interface/wallet.interface");
const wallet_service_1 = require("../wallet/wallet.service");
const payment_methods_config_1 = require("./payment-methods.config");
const payment_constants_1 = require("./payment.constants");
const payment_events_1 = require("./payment.events");
const payment_schema_1 = require("./schemas/payment.schema");
const payment_utils_1 = require("./utils/payment.utils");
let PaymentService = class PaymentService {
    paymentModel;
    walletService;
    eventEmitter;
    constructor(paymentModel, walletService, eventEmitter) {
        this.paymentModel = paymentModel;
        this.walletService = walletService;
        this.eventEmitter = eventEmitter;
    }
    async initiatePayment(dto, session) {
        const { userId, orderId, amount, paymentMethod, currency, metadata } = dto;
        const transactionId = (0, payment_utils_1.generateTransactionId)();
        const payment = new this.paymentModel({
            userId: new mongoose_2.Types.ObjectId(userId),
            orderId: new mongoose_2.Types.ObjectId(orderId),
            transactionId,
            amount,
            currency: currency || constants_1.AppCurrency.BDT,
            paymentMethod,
            status: interface_1.PaymentStatus.PENDING,
            metadata,
        });
        try {
            const savedPayment = await payment.save({ session: session });
            return savedPayment;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to initiate payment: ' + error.message);
        }
    }
    async verifyPayment(transactionId) {
        const payment = await this.paymentModel.findOne({ transactionId });
        if (!payment) {
            throw new common_1.NotFoundException('Payment transaction not found');
        }
        if (payment.status === interface_1.PaymentStatus.PENDING) {
        }
        return payment;
    }
    async processPaymentSuccess(transactionId, gatewayResponse) {
        const payment = await this.paymentModel.findOne({ transactionId });
        if (!payment) {
            throw new common_1.NotFoundException('Payment transaction not found');
        }
        if (payment.status === interface_1.PaymentStatus.PAID ||
            payment.status === interface_1.PaymentStatus.SUCCESS) {
            return payment;
        }
        payment.status = interface_1.PaymentStatus.PAID;
        payment.paidAt = new Date();
        payment.gatewayResponse = gatewayResponse;
        if (gatewayResponse.gatewayTransactionId) {
            payment.gatewayTransactionId = gatewayResponse.gatewayTransactionId;
        }
        try {
            const updatedPayment = await payment.save();
            this.eventEmitter.emit(payment_events_1.PaymentEvents.PAYMENT_COMPLETED, new payment_events_1.PaymentCompletedEvent(updatedPayment._id.toString(), updatedPayment.transactionId, updatedPayment.orderId.toString(), updatedPayment.userId.toString(), updatedPayment.amount, updatedPayment.paymentMethod, updatedPayment.paidAt));
            return updatedPayment;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to process payment success: ' + error.message);
        }
    }
    async processPaymentFailure(transactionId, reason) {
        const payment = await this.paymentModel.findOne({ transactionId });
        if (!payment) {
            throw new common_1.NotFoundException('Payment transaction not found');
        }
        if (payment.status === interface_1.PaymentStatus.PAID ||
            payment.status === interface_1.PaymentStatus.SUCCESS) {
            return payment;
        }
        payment.status = interface_1.PaymentStatus.FAILED;
        payment.failureReason = reason;
        try {
            const updatedPayment = await payment.save();
            this.eventEmitter.emit(payment_events_1.PaymentEvents.PAYMENT_FAILED, new payment_events_1.PaymentFailedEvent(updatedPayment._id.toString(), updatedPayment.transactionId, updatedPayment.orderId.toString(), updatedPayment.userId.toString(), reason));
            return updatedPayment;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to process payment failure: ' + error.message);
        }
    }
    async handleSSLCommerzCallback(payload) {
        const transactionId = payload.tran_id;
        if (!transactionId) {
            throw new common_1.BadRequestException('Invalid SSLCommerz payload');
        }
        if (payload.status === 'VALID') {
            await this.processPaymentSuccess(transactionId, payload);
        }
        else {
            await this.processPaymentFailure(transactionId, payload.failed_reason || 'Gateway Failed');
        }
    }
    async getMyPayments(userId, query) {
        const paginateQueries = (0, helpers_1.pick)(query, constants_1.paginateOptions);
        const { limit, page, skip, sortBy, sortOrder } = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        const filterQuery = {
            userId: new mongoose_2.Types.ObjectId(userId),
        };
        if (query.status)
            filterQuery.status = query.status;
        if (query.paymentMethod)
            filterQuery.paymentMethod = query.paymentMethod;
        if (query.transactionId)
            filterQuery.transactionId = query.transactionId;
        if (query.startDate && query.endDate) {
            filterQuery.createdAt = {
                $gte: new Date(query.startDate),
                $lte: new Date(query.endDate),
            };
        }
        const pagination = { limit, page, skip, sortBy, sortOrder };
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.paymentModel,
            paginationQuery: pagination,
            filterQuery,
        });
    }
    async getPaymentByTransactionId(transactionId, userId) {
        const payment = await this.paymentModel.findOne({
            transactionId,
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async findAll(query) {
        const paginateQueries = (0, helpers_1.pick)(query, constants_1.paginateOptions);
        const { searchTerm, startDate, endDate, ...remainingFilters } = query;
        const filterQuery = {};
        if (searchTerm) {
            filterQuery['$or'] = payment_constants_1.paymentSearchableFields.map((field) => ({
                [field]: { $regex: searchTerm, $options: 'i' },
            }));
        }
        const andConditions = [];
        if (Object.keys(remainingFilters).length) {
            Object.entries(remainingFilters).forEach(([key, value]) => {
                if (key === 'orderId') {
                    andConditions.push({ [key]: new mongoose_2.Types.ObjectId(value) });
                }
                else {
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
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.paymentModel,
            paginationQuery: pagination,
            filterQuery,
        });
    }
    async findOne(id) {
        const payment = await this.paymentModel.findById(id);
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
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
    async manualUpdateStatus(id, dto) {
        const payment = await this.paymentModel.findById(id);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        payment.status = dto.status;
        payment.metadata = {
            ...payment.metadata,
            manualUpdateReason: dto.reason,
            updatedAt: new Date(),
        };
        if (dto.status === interface_1.PaymentStatus.PAID && !payment.paidAt) {
            payment.paidAt = new Date();
        }
        return await payment.save();
    }
    async initiateRefund(paymentId, amount, reason) {
        const payment = await this.paymentModel.findById(paymentId);
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        if (payment.status !== interface_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('Can only refund PAID transactions');
        }
        payment.status = interface_1.PaymentStatus.REFUNDED;
        payment.refundedAt = new Date();
        payment.metadata = {
            ...payment.metadata,
            refundReason: reason,
            refundAmount: amount,
        };
        const updatedPayment = await payment.save();
        this.eventEmitter.emit(payment_events_1.PaymentEvents.REFUND_INITIATED, new payment_events_1.RefundInitiatedEvent(updatedPayment._id.toString(), updatedPayment.transactionId, updatedPayment.orderId.toString(), amount, reason));
        return updatedPayment;
    }
    getAvailablePaymentMethods() {
        return payment_methods_config_1.AVAILABLE_PAYMENT_METHODS;
    }
    async paymentRequest(event) {
        const { orderId, userId, totalAmount, paymentIntent, session } = event.payload;
        let remainingAmount = totalAmount;
        try {
            if (paymentIntent.useCashback && remainingAmount > 0) {
                const wallet = await this.walletService.getWallet(userId);
                const deductAmount = Math.min(wallet.cashbackBalance, remainingAmount);
                if (deductAmount > 0) {
                    await this.walletService.deductFunds(userId, deductAmount, wallet_interface_1.WalletBalanceType.CASHBACK, orderId, session);
                    remainingAmount -= deductAmount;
                }
            }
            if (paymentIntent.useWallet && remainingAmount > 0) {
                const wallet = await this.walletService.getWallet(userId);
                const deductAmount = Math.min(wallet.depositBalance, remainingAmount);
                if (deductAmount > 0) {
                    await this.walletService.deductFunds(userId, deductAmount, wallet_interface_1.WalletBalanceType.DEPOSIT, orderId, session);
                    remainingAmount -= deductAmount;
                }
            }
            if (remainingAmount <= 0) {
                return { status: interface_1.PaymentStatus.PAID };
            }
            if (paymentIntent.method === interface_1.PaymentMethod.COD) {
                const payment = await this.initiatePayment({
                    userId,
                    orderId,
                    amount: remainingAmount,
                    paymentMethod: paymentIntent.method,
                    metadata: { source: 'checkout', type: interface_1.PaymentMethod.COD },
                }, session);
                return {
                    status: interface_1.PaymentStatus.PENDING,
                    transactionId: payment.transactionId,
                    gatewayUrl: undefined,
                };
            }
            const payment = await this.initiatePayment({
                userId,
                orderId,
                amount: remainingAmount,
                paymentMethod: paymentIntent.method,
                metadata: { source: 'checkout' },
            }, session);
            return {
                status: interface_1.PaymentStatus.PENDING,
                transactionId: payment.transactionId,
                gatewayUrl: payment.gatewayUrl ||
                    `/pay/${payment.paymentMethod.toLowerCase()}/${payment.transactionId}`,
            };
        }
        catch (error) {
            console.error('Payment delegation failed:', error);
            return { status: interface_1.PaymentStatus.FAILED };
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        wallet_service_1.WalletService,
        event_emitter_1.EventEmitter2])
], PaymentService);
//# sourceMappingURL=payment.service.js.map