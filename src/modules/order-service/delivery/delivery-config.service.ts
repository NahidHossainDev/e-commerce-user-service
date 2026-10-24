import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CreateDeliveryZoneDto,
  UpdateDeliveryZoneDto,
  UpdateGlobalDeliveryConfigDto,
} from './dto/delivery-config.dto';
import {
  DeliveryConfig,
  DeliveryConfigDocument,
  DeliveryZone,
  FreeDeliveryPolicy,
} from './schemas/delivery-config.schema';

export interface CalculatedDeliveryFeeResult {
  deliveryFee: number;
  zoneName: string;
  isFreeDelivery: boolean;
  reason?: string;
  minOrderForFreeDelivery?: number | null;
  estimatedDays?: string;
}

@Injectable()
export class DeliveryConfigService {
  constructor(
    @InjectModel(DeliveryConfig.name)
    private readonly deliveryConfigModel: Model<DeliveryConfigDocument>,
  ) {}

  /**
   * Returns existing config or initializes default production zones.
   */
  async getOrCreateConfig(): Promise<DeliveryConfigDocument> {
    let config = await this.deliveryConfigModel.findOne();
    if (!config) {
      config = await this.deliveryConfigModel.create({
        defaultFee: 60,
        enableGlobalFreeDelivery: false,
        globalFreeDeliveryMinOrder: null,
        zones: [
          {
            _id: new Types.ObjectId(),
            name: 'Inside Dhaka',
            code: 'INSIDE_DHAKA',
            deliveryFee: 70,
            isDefault: false,
            isActive: true,
            matchedCities: ['Dhaka', 'Keraniganj', 'Savar', 'Gazipur', 'Narayanganj'],
            freeDeliveryPolicy: FreeDeliveryPolicy.MIN_ORDER_AMOUNT,
            minOrderForFreeDelivery: 800,
            estimatedDays: '1-2 Business Days',
          },
          {
            _id: new Types.ObjectId(),
            name: 'Outside Dhaka',
            code: 'OUTSIDE_DHAKA',
            deliveryFee: 120,
            isDefault: true,
            isActive: true,
            matchedCities: [],
            freeDeliveryPolicy: FreeDeliveryPolicy.NONE,
            minOrderForFreeDelivery: null,
            estimatedDays: '3-5 Business Days',
          },
        ],
      });
    }
    return config;
  }

  /**
   * Authoritative calculation engine following hierarchical rule evaluation.
   */
  async calculateDeliveryFee(
    subTotal: number,
    city?: string,
    coupon?: any,
  ): Promise<CalculatedDeliveryFeeResult> {
    if (subTotal === 0) {
      return {
        deliveryFee: 0,
        zoneName: 'N/A',
        isFreeDelivery: true,
        reason: 'Empty cart',
      };
    }

    // 1. Coupon Override (FREE_SHIPPING)
    if (coupon && coupon.discountType === 'FREE_SHIPPING') {
      return {
        deliveryFee: 0,
        zoneName: 'Coupon Applied',
        isFreeDelivery: true,
        reason: 'Free shipping coupon',
      };
    }

    const config = await this.getOrCreateConfig();

    // 2. Global Promotional Free Delivery
    if (
      config.enableGlobalFreeDelivery &&
      config.globalFreeDeliveryMinOrder !== null &&
      config.globalFreeDeliveryMinOrder !== undefined &&
      subTotal >= config.globalFreeDeliveryMinOrder
    ) {
      return {
        deliveryFee: 0,
        zoneName: 'Storewide Promotion',
        isFreeDelivery: true,
        reason: `Storewide free shipping on orders ৳${config.globalFreeDeliveryMinOrder}+`,
      };
    }

    // 3. Match Delivery Zone by City
    const activeZones = (config.zones || []).filter((z) => z.isActive);
    let matchedZone: DeliveryZone | undefined;

    if (city && city.trim().length > 0) {
      const normalizedCity = city.trim().toLowerCase();
      matchedZone = activeZones.find((zone) =>
        (zone.matchedCities || []).some(
          (c) =>
            c.trim().toLowerCase() === normalizedCity ||
            normalizedCity.includes(c.trim().toLowerCase()) ||
            c.trim().toLowerCase().includes(normalizedCity),
        ),
      );
    }

    // Fallback to default zone
    if (!matchedZone) {
      matchedZone = activeZones.find((zone) => zone.isDefault);
    }

    // Ultimate fallback if no zone configured
    if (!matchedZone) {
      matchedZone = activeZones[0] || {
        name: 'Standard Delivery',
        code: 'STANDARD',
        deliveryFee: config.defaultFee ?? 60,
        isDefault: true,
        isActive: true,
        matchedCities: [],
        freeDeliveryPolicy: FreeDeliveryPolicy.NONE,
      };
    }

    // 4. Zone Free Delivery Rule Evaluation
    if (matchedZone.freeDeliveryPolicy === FreeDeliveryPolicy.ALWAYS_FREE) {
      return {
        deliveryFee: 0,
        zoneName: matchedZone.name,
        isFreeDelivery: true,
        reason: 'Always free in this zone',
        estimatedDays: matchedZone.estimatedDays,
      };
    }

    if (
      matchedZone.freeDeliveryPolicy === FreeDeliveryPolicy.MIN_ORDER_AMOUNT &&
      matchedZone.minOrderForFreeDelivery &&
      subTotal >= matchedZone.minOrderForFreeDelivery
    ) {
      return {
        deliveryFee: 0,
        zoneName: matchedZone.name,
        isFreeDelivery: true,
        reason: `Free delivery above ৳${matchedZone.minOrderForFreeDelivery}`,
        minOrderForFreeDelivery: matchedZone.minOrderForFreeDelivery,
        estimatedDays: matchedZone.estimatedDays,
      };
    }

    return {
      deliveryFee: matchedZone.deliveryFee,
      zoneName: matchedZone.name,
      isFreeDelivery: false,
      minOrderForFreeDelivery: matchedZone.minOrderForFreeDelivery,
      estimatedDays: matchedZone.estimatedDays,
    };
  }

  /**
   * Admin: Update global store-wide delivery settings.
   */
  async updateGlobalConfig(dto: UpdateGlobalDeliveryConfigDto): Promise<DeliveryConfigDocument> {
    const config = await this.getOrCreateConfig();

    if (dto.defaultFee !== undefined) config.defaultFee = dto.defaultFee;
    if (dto.enableGlobalFreeDelivery !== undefined) {
      config.enableGlobalFreeDelivery = dto.enableGlobalFreeDelivery;
    }
    if (dto.globalFreeDeliveryMinOrder !== undefined) {
      config.globalFreeDeliveryMinOrder = dto.globalFreeDeliveryMinOrder;
    }

    return config.save();
  }

  /**
   * Admin: Add a new delivery zone.
   */
  async addZone(dto: CreateDeliveryZoneDto): Promise<DeliveryConfigDocument> {
    const config = await this.getOrCreateConfig();

    // Check code duplication
    const exists = (config.zones || []).some(
      (z) => z.code.toUpperCase() === dto.code.trim().toUpperCase(),
    );
    if (exists) {
      throw new BadRequestException(`Zone with code '${dto.code}' already exists`);
    }

    // If marked as default, unset other defaults
    if (dto.isDefault) {
      config.zones.forEach((z) => {
        z.isDefault = false;
      });
    }

    const newZone = {
      _id: new Types.ObjectId(),
      name: dto.name.trim(),
      code: dto.code.trim().toUpperCase(),
      deliveryFee: dto.deliveryFee,
      isDefault: Boolean(dto.isDefault),
      isActive: dto.isActive !== undefined ? dto.isActive : true,
      matchedCities: (dto.matchedCities || []).map((c) => c.trim()).filter(Boolean),
      freeDeliveryPolicy: dto.freeDeliveryPolicy || FreeDeliveryPolicy.NONE,
      minOrderForFreeDelivery: dto.minOrderForFreeDelivery ?? null,
      estimatedDays: dto.estimatedDays?.trim() || '',
    };

    config.zones.push(newZone as any);
    return config.save();
  }

  /**
   * Admin: Update an existing delivery zone.
   */
  async updateZone(zoneId: string, dto: UpdateDeliveryZoneDto): Promise<DeliveryConfigDocument> {
    const config = await this.getOrCreateConfig();
    const zoneIndex = config.zones.findIndex((z) => z._id.toString() === zoneId);

    if (zoneIndex === -1) {
      throw new NotFoundException(`Delivery zone not found`);
    }

    if (dto.isDefault) {
      config.zones.forEach((z) => {
        z.isDefault = false;
      });
    }

    const zone = config.zones[zoneIndex];
    if (dto.name !== undefined) zone.name = dto.name.trim();
    if (dto.code !== undefined) zone.code = dto.code.trim().toUpperCase();
    if (dto.deliveryFee !== undefined) zone.deliveryFee = dto.deliveryFee;
    if (dto.isDefault !== undefined) zone.isDefault = dto.isDefault;
    if (dto.isActive !== undefined) zone.isActive = dto.isActive;
    if (dto.matchedCities !== undefined) {
      zone.matchedCities = dto.matchedCities.map((c) => c.trim()).filter(Boolean);
    }
    if (dto.freeDeliveryPolicy !== undefined) zone.freeDeliveryPolicy = dto.freeDeliveryPolicy;
    if (dto.minOrderForFreeDelivery !== undefined) {
      zone.minOrderForFreeDelivery = dto.minOrderForFreeDelivery;
    }
    if (dto.estimatedDays !== undefined) zone.estimatedDays = dto.estimatedDays.trim();

    config.markModified('zones');
    return config.save();
  }

  /**
   * Admin: Delete a delivery zone.
   */
  async deleteZone(zoneId: string): Promise<DeliveryConfigDocument> {
    const config = await this.getOrCreateConfig();
    const zoneIndex = config.zones.findIndex((z) => z._id.toString() === zoneId);

    if (zoneIndex === -1) {
      throw new NotFoundException(`Delivery zone not found`);
    }

    if (config.zones.length <= 1) {
      throw new BadRequestException('Cannot delete the last remaining delivery zone');
    }

    config.zones.splice(zoneIndex, 1);

    // If deleted zone was default, make first remaining zone default
    if (!config.zones.some((z) => z.isDefault)) {
      config.zones[0].isDefault = true;
    }

    config.markModified('zones');
    return config.save();
  }
}
