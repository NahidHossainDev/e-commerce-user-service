import { EventEmitter2 } from '@nestjs/event-emitter';
import { Connection, Model } from 'mongoose';
import { IPaginatedResponse } from 'src/common/interface';
import { CartService } from 'src/modules/order-service/cart/cart.service';
import { CouponService } from 'src/modules/order-service/coupon/coupon.service';
import { ApplyCouponDto, CancelOrderDto, CheckoutDto, UpdateOrderStatusDto, UpdatePaymentStatusDto } from './dto/order.dto';
import { OrderQueryOptions } from './dto/order.query-options.dto';
import { BillingInfo, OrderDocument } from './schemas/order.schema';
export declare class OrderService {
    private orderModel;
    private readonly cartService;
    private readonly couponService;
    private readonly eventEmitter;
    private readonly connection;
    constructor(orderModel: Model<OrderDocument>, cartService: CartService, couponService: CouponService, eventEmitter: EventEmitter2, connection: Connection);
    checkout(userId: string, payload: CheckoutDto): Promise<OrderDocument>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<OrderDocument>;
    findAll(query: OrderQueryOptions): Promise<IPaginatedResponse<OrderDocument>>;
    findAllByUser(userId: string, query: OrderQueryOptions): Promise<IPaginatedResponse<OrderDocument>>;
    findOne(id: string): Promise<OrderDocument>;
    getOrderByOrderId(userId: string, orderId: string): Promise<OrderDocument>;
    updatePaymentStatus(id: string, dto: UpdatePaymentStatusDto): Promise<OrderDocument>;
    cancelOrder(userId: string, orderId: string, dto: CancelOrderDto): Promise<OrderDocument>;
    getStats(): Promise<any>;
    applyCoupon(userId: string, dto: ApplyCouponDto): Promise<BillingInfo>;
    removeCoupon(userId: string): Promise<BillingInfo>;
    private calculateBilling;
}
