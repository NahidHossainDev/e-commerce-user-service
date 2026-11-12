import { DeliveryConfigService } from '../delivery-config.service';
import { CalculateDeliveryFeeDto } from '../dto/delivery-config.dto';
export declare class DeliveryConfigController {
    private readonly deliveryConfigService;
    constructor(deliveryConfigService: DeliveryConfigService);
    getPublicConfig(): Promise<{
        defaultFee: number;
        enableGlobalFreeDelivery: boolean;
        globalFreeDeliveryMinOrder: number | null | undefined;
        zones: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            code: string;
            deliveryFee: number;
            isDefault: boolean;
            matchedCities: string[];
            freeDeliveryPolicy: import("../schemas/delivery-config.schema").FreeDeliveryPolicy;
            minOrderForFreeDelivery: number | null | undefined;
            estimatedDays: string | undefined;
        }[];
    }>;
    calculateFee(dto: CalculateDeliveryFeeDto): Promise<import("../delivery-config.service").CalculatedDeliveryFeeResult>;
}
