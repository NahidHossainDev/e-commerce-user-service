import { DeliveryConfigService } from '../delivery-config.service';
import { CreateDeliveryZoneDto, UpdateDeliveryZoneDto, UpdateGlobalDeliveryConfigDto } from '../dto/delivery-config.dto';
export declare class AdminDeliveryConfigController {
    private readonly deliveryConfigService;
    constructor(deliveryConfigService: DeliveryConfigService);
    getConfig(): Promise<import("mongoose").Document<unknown, {}, import("../schemas/delivery-config.schema").DeliveryConfig, {}, {}> & import("../schemas/delivery-config.schema").DeliveryConfig & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateGlobal(dto: UpdateGlobalDeliveryConfigDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/delivery-config.schema").DeliveryConfig, {}, {}> & import("../schemas/delivery-config.schema").DeliveryConfig & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    addZone(dto: CreateDeliveryZoneDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/delivery-config.schema").DeliveryConfig, {}, {}> & import("../schemas/delivery-config.schema").DeliveryConfig & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateZone(zoneId: string, dto: UpdateDeliveryZoneDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/delivery-config.schema").DeliveryConfig, {}, {}> & import("../schemas/delivery-config.schema").DeliveryConfig & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteZone(zoneId: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/delivery-config.schema").DeliveryConfig, {}, {}> & import("../schemas/delivery-config.schema").DeliveryConfig & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
