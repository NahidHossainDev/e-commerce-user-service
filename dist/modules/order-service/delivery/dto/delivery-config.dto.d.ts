import { FreeDeliveryPolicy } from '../schemas/delivery-config.schema';
export declare class CreateDeliveryZoneDto {
    name: string;
    code: string;
    deliveryFee: number;
    isDefault?: boolean;
    isActive?: boolean;
    matchedCities?: string[];
    freeDeliveryPolicy: FreeDeliveryPolicy;
    minOrderForFreeDelivery?: number | null;
    estimatedDays?: string;
}
export declare class UpdateDeliveryZoneDto {
    name?: string;
    code?: string;
    deliveryFee?: number;
    isDefault?: boolean;
    isActive?: boolean;
    matchedCities?: string[];
    freeDeliveryPolicy?: FreeDeliveryPolicy;
    minOrderForFreeDelivery?: number | null;
    estimatedDays?: string;
}
export declare class UpdateGlobalDeliveryConfigDto {
    defaultFee?: number;
    enableGlobalFreeDelivery?: boolean;
    globalFreeDeliveryMinOrder?: number | null;
}
export declare class CalculateDeliveryFeeDto {
    subTotal: number;
    city?: string;
    couponCode?: string;
}
