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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../../common/constants");
const inventory_events_1 = require("../../../common/events/inventory.events");
const user_events_1 = require("../../../common/events/user.events");
const cart_service_1 = require("../cart/cart.service");
const coupon_service_1 = require("../coupon/coupon.service");
const helpers_1 = require("../../../utils/helpers");
const getPaginatedData_1 = require("../../../utils/mongodb/getPaginatedData");
const order_events_1 = require("../../../common/events/order.events");
const coupon_schema_1 = require("../coupon/schemas/coupon.schema");
const order_constants_1 = require("./order.constants");
const order_schema_1 = require("./schemas/order.schema");
const order_utils_1 = require("./utils/order.utils");
let OrderService = class OrderService {
    orderModel;
    cartService;
    couponService;
    eventEmitter;
    connection;
    constructor(orderModel, cartService, couponService, eventEmitter, connection) {
        this.orderModel = orderModel;
        this.cartService = cartService;
        this.couponService = couponService;
        this.eventEmitter = eventEmitter;
        this.connection = connection;
    }
    async checkout(userId, payload) {
        const cart = await this.cartService.getCart(userId);
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        let coupon;
        if (payload.couponId) {
            coupon = await this.couponService.validateCoupon({
                userId,
                couponId: payload.couponId,
                orderAmount: cart.totalAmount,
            });
        }
        const billingInfo = this.calculateBilling(cart, coupon);
        const [addressResult] = (await this.eventEmitter.emitAsync(user_events_1.UserEvents.VALIDATE_ADDRESS, new user_events_1.AddressValidateEvent({ userId, addressId: payload.addressId })));
        if (!addressResult?.isValid) {
            throw new common_1.BadRequestException(addressResult?.error || 'Invalid shipping address');
        }
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const orderId = (0, order_utils_1.generateOrderId)();
            const orderItems = cart.items.map((item) => {
                const unitPrice = item.price.discountPrice > 0
                    ? item.price.discountPrice
                    : item.price.basePrice;
                return {
                    productId: item.productId,
                    name: item.productName,
                    thumbnail: item.productThumbnail,
                    variantSku: item.variantSku,
                    quantity: item.quantity,
                    price: item.price,
                    total: unitPrice * item.quantity,
                };
            });
            const order = new this.orderModel({
                orderId,
                userId: new mongoose_2.Types.ObjectId(userId),
                items: orderItems,
                addressId: new mongoose_2.Types.ObjectId(payload.addressId),
                status: order_schema_1.OrderStatus.PENDING,
                billingInfo: {
                    ...billingInfo,
                    paymentMethod: payload.paymentIntent.method,
                },
                placedAt: new Date(),
            });
            const savedOrder = await order.save({ session: session });
            for (const item of orderItems) {
                await this.eventEmitter.emitAsync(inventory_events_1.InventoryEvents.ADJUST_STOCK, new inventory_events_1.InventoryAdjustEvent({
                    productId: item.productId.toString(),
                    quantity: -item.quantity,
                    type: inventory_events_1.InventoryTransactionType.SALE,
                    variantSku: item.variantSku,
                    referenceId: orderId,
                    reason: `Order placement: ${orderId}`,
                    session: session,
                }));
            }
            await this.cartService.clearCart(userId, session);
            const [paymentResult] = (await this.eventEmitter.emitAsync(order_events_1.OrderEvents.REQUEST_PAYMENT, new order_events_1.OrderPaymentRequestEvent({
                orderId: savedOrder.orderId,
                userId,
                totalAmount: billingInfo.totalAmount,
                paymentIntent: payload.paymentIntent,
                session: session,
            })));
            if (!paymentResult || paymentResult.status === 'FAILED') {
                throw new common_1.BadRequestException('Payment initiation failed');
            }
            savedOrder.billingInfo.paymentStatus =
                paymentResult.status === 'PAID'
                    ? order_schema_1.PaymentStatus.PAID
                    : order_schema_1.PaymentStatus.PENDING;
            if (paymentResult.transactionId) {
                savedOrder.billingInfo.paymentTransactionId =
                    paymentResult.transactionId;
            }
            const checkoutOrder = await savedOrder.save({ session: session });
            if (billingInfo.appliedCouponId) {
                const coupon = await this.couponService.findActiveCouponById(billingInfo.appliedCouponId.toString(), session);
                if (coupon) {
                    await this.couponService.incrementUsage({
                        couponId: coupon._id.toString(),
                        userId: userId,
                        orderId: savedOrder.orderId,
                        discountAmount: billingInfo.couponDiscount,
                    }, session);
                }
            }
            const event = {
                orderId: savedOrder.orderId,
                userId: userId,
                items: orderItems.map((i) => ({
                    productId: i.productId.toString(),
                    name: i.name,
                    variantSku: i.variantSku,
                    quantity: i.quantity,
                })),
                totalAmount: savedOrder.billingInfo.totalAmount,
                payableAmount: savedOrder.billingInfo.payableAmount,
                timestamp: new Date(),
            };
            void this.eventEmitter.emit(order_events_1.OrderEvents.ORDER_CREATED, event);
            await session.commitTransaction();
            return {
                ...checkoutOrder.toObject(),
                paymentResult,
            };
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async updateStatus(id, dto) {
        const order = await this.orderModel.findById(id);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        order.status = dto.status;
        const now = new Date();
        switch (dto.status) {
            case order_schema_1.OrderStatus.CONFIRMED:
                order.confirmedAt = now;
                break;
            case order_schema_1.OrderStatus.SHIPPED:
                order.shippedAt = now;
                break;
            case order_schema_1.OrderStatus.DELIVERED:
                order.deliveredAt = now;
                order.billingInfo.paymentStatus = order_schema_1.PaymentStatus.PAID;
                break;
            case order_schema_1.OrderStatus.CANCELLED:
                order.cancelledAt = now;
                order.cancellationReason = dto.reason || 'No reason provided';
                break;
        }
        const updatedOrder = await order.save();
        void this.eventEmitter.emit(order_events_1.OrderEvents.ORDER_STATUS_UPDATED, {
            orderId: updatedOrder.orderId,
            status: updatedOrder.status,
        });
        return updatedOrder;
    }
    async findAll(query) {
        const paginateQueries = (0, helpers_1.pick)(query, constants_1.paginateOptions);
        if (paginateQueries.sortOrder) {
            paginateQueries.sortOrder = paginateQueries.sortOrder === 'asc' ? 1 : -1;
        }
        const { searchTerm, ...remainingFilters } = query;
        const filterQuery = {};
        if (searchTerm) {
            filterQuery['$or'] = order_constants_1.orderSearchableFields.map((field) => ({
                [field]: { $regex: searchTerm, $options: 'i' },
            }));
        }
        if (Object.keys(remainingFilters).length) {
            Object.entries(remainingFilters).forEach(([key, value]) => {
                if (order_constants_1.orderFilterableFields.includes(key) && value) {
                    filterQuery[key] = value;
                }
            });
        }
        if (query.paymentStatus) {
            delete filterQuery['paymentStatus'];
            filterQuery['billingInfo.paymentStatus'] = query.paymentStatus;
        }
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.orderModel,
            paginationQuery: pagination,
            filterQuery,
        });
    }
    async findAllByUser(userId, query) {
        query.userId = userId;
        return this.findAll(query);
    }
    async findOne(id) {
        const order = await this.orderModel.findById(id);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async getOrderByOrderId(userId, orderId) {
        const order = await this.orderModel.findOne({
            orderId,
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async updatePaymentStatus(id, dto) {
        const order = await this.orderModel.findById(id);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        order.billingInfo.paymentStatus = dto.status;
        if (dto.transactionId) {
            order.billingInfo.paymentTransactionId = dto.transactionId;
        }
        if (dto.failureReason) {
            order.billingInfo.paymentFailureReason = dto.failureReason;
        }
        if (dto.status === order_schema_1.PaymentStatus.PAID) {
            if (order.status === order_schema_1.OrderStatus.PENDING) {
                order.status = order_schema_1.OrderStatus.CONFIRMED;
                order.confirmedAt = new Date();
            }
        }
        const updatedOrder = await order.save();
        void this.eventEmitter.emit(order_events_1.OrderEvents.ORDER_STATUS_UPDATED, {
            orderId: updatedOrder.orderId,
            status: updatedOrder.status,
            paymentStatus: updatedOrder.billingInfo.paymentStatus,
        });
        return updatedOrder;
    }
    async cancelOrder(userId, orderId, dto) {
        const order = await this.orderModel.findOne({
            orderId,
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const cancellableStatuses = [order_schema_1.OrderStatus.PENDING, order_schema_1.OrderStatus.CONFIRMED];
        if (!cancellableStatuses.includes(order.status)) {
            throw new common_1.BadRequestException(`Order cannot be cancelled in ${order.status} status`);
        }
        return this.updateStatus(order._id, {
            status: order_schema_1.OrderStatus.CANCELLED,
            reason: dto.reason,
        });
    }
    async getStats() {
        const stats = await this.orderModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: {
                        $sum: {
                            $cond: [
                                { $eq: ['$billingInfo.paymentStatus', order_schema_1.PaymentStatus.PAID] },
                                '$billingInfo.payableAmount',
                                0,
                            ],
                        },
                    },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ['$status', order_schema_1.OrderStatus.PENDING] }, 1, 0] },
                    },
                    confirmedOrders: {
                        $sum: {
                            $cond: [{ $eq: ['$status', order_schema_1.OrderStatus.CONFIRMED] }, 1, 0],
                        },
                    },
                    shippedOrders: {
                        $sum: { $cond: [{ $eq: ['$status', order_schema_1.OrderStatus.SHIPPED] }, 1, 0] },
                    },
                    deliveredOrders: {
                        $sum: {
                            $cond: [{ $eq: ['$status', order_schema_1.OrderStatus.DELIVERED] }, 1, 0],
                        },
                    },
                    cancelledOrders: {
                        $sum: {
                            $cond: [{ $eq: ['$status', order_schema_1.OrderStatus.CANCELLED] }, 1, 0],
                        },
                    },
                },
            },
        ]);
        return (stats[0] || {
            totalOrders: 0,
            totalRevenue: 0,
            pendingOrders: 0,
            confirmedOrders: 0,
            shippedOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0,
        });
    }
    async applyCoupon(userId, dto) {
        const cart = await this.cartService.getCart(userId);
        const coupon = await this.couponService.validateCoupon({
            code: dto.code,
            userId,
            orderAmount: cart.totalAmount,
        });
        return this.calculateBilling(cart, coupon);
    }
    async removeCoupon(userId) {
        const cart = await this.cartService.getCart(userId);
        return this.calculateBilling(cart);
    }
    calculateBilling(cart, coupon) {
        const totalAmount = cart.totalAmount;
        const itemLevelDiscount = cart.totalDiscount || 0;
        let couponDiscount = 0;
        const deliveryCharge = 0;
        if (coupon) {
            if (coupon.discountType === coupon_schema_1.DiscountType.PERCENTAGE) {
                couponDiscount = (totalAmount * coupon.discountValue) / 100;
                if (coupon.maxDiscountAmount &&
                    couponDiscount > coupon.maxDiscountAmount) {
                    couponDiscount = coupon.maxDiscountAmount;
                }
            }
            else if (coupon.discountType === coupon_schema_1.DiscountType.FIXED_AMOUNT) {
                couponDiscount = Math.min(coupon.discountValue, totalAmount);
            }
        }
        const totalDiscount = itemLevelDiscount + couponDiscount;
        const payableAmount = Math.max(0, totalAmount - totalDiscount + deliveryCharge);
        return {
            totalAmount,
            discount: itemLevelDiscount,
            appliedCouponId: coupon?._id,
            couponDiscount,
            deliveryCharge,
            payableAmount,
            walletUsed: 0,
            cashbackUsed: 0,
            paymentStatus: order_schema_1.PaymentStatus.PENDING,
            paymentAttempt: 0,
        };
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(4, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        cart_service_1.CartService,
        coupon_service_1.CouponService,
        event_emitter_1.EventEmitter2,
        mongoose_2.Connection])
], OrderService);
//# sourceMappingURL=order.service.js.map