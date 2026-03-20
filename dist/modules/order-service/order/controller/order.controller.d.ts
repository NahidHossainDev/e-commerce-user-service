import { IAuthUser } from 'src/common/interface';
import { ApplyCouponDto, CheckoutDto } from '../dto/order.dto';
import { OrderQueryOptions } from '../dto/order.query-options.dto';
import { OrderService } from '../order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    checkout(user: IAuthUser, dto: CheckoutDto): Promise<import("../schemas/order.schema").OrderDocument>;
    findAll(user: IAuthUser, query: OrderQueryOptions): Promise<import("src/common/interface").IPaginatedResponse<import("../schemas/order.schema").OrderDocument>>;
    findOne(user: IAuthUser, orderId: string): Promise<import("../schemas/order.schema").OrderDocument>;
    applyCoupon(user: IAuthUser, dto: ApplyCouponDto): Promise<import("../schemas/order.schema").BillingInfo>;
    removeCoupon(user: IAuthUser): Promise<import("../schemas/order.schema").BillingInfo>;
}
