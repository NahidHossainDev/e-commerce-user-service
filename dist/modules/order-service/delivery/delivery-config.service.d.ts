import { Model } from 'mongoose';
import { CreateDeliveryZoneDto, UpdateDeliveryZoneDto, UpdateGlobalDeliveryConfigDto } from './dto/delivery-config.dto';
import { DeliveryConfigDocument } from './schemas/delivery-config.schema';
export interface CalculatedDeliveryFeeResult {
    deliveryFee: number;
    zoneName: string;
    isFreeDelivery: boolean;
    reason?: string;
    minOrderForFreeDelivery?: number | null;
    estimatedDays?: string;
}
export declare class DeliveryConfigService {
    private readonly deliveryConfigModel;
    constructor(deliveryConfigModel: Model<DeliveryConfigDocument>);
    getOrCreateConfig(): Promise<DeliveryConfigDocument>;
    calculateDeliveryFee(subTotal: number, city?: string, coupon?: any): Promise<CalculatedDeliveryFeeResult>;
    updateGlobalConfig(dto: UpdateGlobalDeliveryConfigDto): Promise<DeliveryConfigDocument>;
    addZone(dto: CreateDeliveryZoneDto): Promise<DeliveryConfigDocument>;
    updateZone(zoneId: string, dto: UpdateDeliveryZoneDto): Promise<DeliveryConfigDocument>;
    deleteZone(zoneId: string): Promise<DeliveryConfigDocument>;
}
