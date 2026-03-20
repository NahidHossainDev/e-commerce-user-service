import { UpdateOrderStatusDto, UpdatePaymentStatusDto } from '../dto/order.dto';
import { OrderQueryOptions } from '../dto/order.query-options.dto';
import { OrderService } from '../order.service';
export declare class AdminOrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getStats(): Promise<any>;
    findAll(query: OrderQueryOptions): Promise<import("src/common/interface").IPaginatedResponse<import("../schemas/order.schema").OrderDocument>>;
    findOne(id: string): Promise<import("../schemas/order.schema").OrderDocument>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<import("../schemas/order.schema").OrderDocument>;
    updatePaymentStatus(id: string, dto: UpdatePaymentStatusDto): Promise<import("../schemas/order.schema").OrderDocument>;
}
