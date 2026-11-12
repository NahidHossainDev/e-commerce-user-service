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
exports.DeliveryConfigService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const delivery_config_schema_1 = require("./schemas/delivery-config.schema");
let DeliveryConfigService = class DeliveryConfigService {
    deliveryConfigModel;
    constructor(deliveryConfigModel) {
        this.deliveryConfigModel = deliveryConfigModel;
    }
    async getOrCreateConfig() {
        let config = await this.deliveryConfigModel.findOne();
        if (!config) {
            config = await this.deliveryConfigModel.create({
                defaultFee: 60,
                enableGlobalFreeDelivery: false,
                globalFreeDeliveryMinOrder: null,
                zones: [
                    {
                        _id: new mongoose_2.Types.ObjectId(),
                        name: 'Inside Dhaka',
                        code: 'INSIDE_DHAKA',
                        deliveryFee: 70,
                        isDefault: false,
                        isActive: true,
                        matchedCities: ['Dhaka', 'Keraniganj', 'Savar', 'Gazipur', 'Narayanganj'],
                        freeDeliveryPolicy: delivery_config_schema_1.FreeDeliveryPolicy.MIN_ORDER_AMOUNT,
                        minOrderForFreeDelivery: 800,
                        estimatedDays: '1-2 Business Days',
                    },
                    {
                        _id: new mongoose_2.Types.ObjectId(),
                        name: 'Outside Dhaka',
                        code: 'OUTSIDE_DHAKA',
                        deliveryFee: 120,
                        isDefault: true,
                        isActive: true,
                        matchedCities: [],
                        freeDeliveryPolicy: delivery_config_schema_1.FreeDeliveryPolicy.NONE,
                        minOrderForFreeDelivery: null,
                        estimatedDays: '3-5 Business Days',
                    },
                ],
            });
        }
        return config;
    }
    async calculateDeliveryFee(subTotal, city, coupon) {
        if (subTotal === 0) {
            return {
                deliveryFee: 0,
                zoneName: 'N/A',
                isFreeDelivery: true,
                reason: 'Empty cart',
            };
        }
        if (coupon && coupon.discountType === 'FREE_SHIPPING') {
            return {
                deliveryFee: 0,
                zoneName: 'Coupon Applied',
                isFreeDelivery: true,
                reason: 'Free shipping coupon',
            };
        }
        const config = await this.getOrCreateConfig();
        if (config.enableGlobalFreeDelivery &&
            config.globalFreeDeliveryMinOrder !== null &&
            config.globalFreeDeliveryMinOrder !== undefined &&
            subTotal >= config.globalFreeDeliveryMinOrder) {
            return {
                deliveryFee: 0,
                zoneName: 'Storewide Promotion',
                isFreeDelivery: true,
                reason: `Storewide free shipping on orders ৳${config.globalFreeDeliveryMinOrder}+`,
            };
        }
        const activeZones = (config.zones || []).filter((z) => z.isActive);
        let matchedZone;
        if (city && city.trim().length > 0) {
            const normalizedCity = city.trim().toLowerCase();
            matchedZone = activeZones.find((zone) => (zone.matchedCities || []).some((c) => c.trim().toLowerCase() === normalizedCity ||
                normalizedCity.includes(c.trim().toLowerCase()) ||
                c.trim().toLowerCase().includes(normalizedCity)));
        }
        if (!matchedZone) {
            matchedZone = activeZones.find((zone) => zone.isDefault);
        }
        if (!matchedZone) {
            matchedZone = activeZones[0] || {
                name: 'Standard Delivery',
                code: 'STANDARD',
                deliveryFee: config.defaultFee ?? 60,
                isDefault: true,
                isActive: true,
                matchedCities: [],
                freeDeliveryPolicy: delivery_config_schema_1.FreeDeliveryPolicy.NONE,
            };
        }
        if (matchedZone.freeDeliveryPolicy === delivery_config_schema_1.FreeDeliveryPolicy.ALWAYS_FREE) {
            return {
                deliveryFee: 0,
                zoneName: matchedZone.name,
                isFreeDelivery: true,
                reason: 'Always free in this zone',
                estimatedDays: matchedZone.estimatedDays,
            };
        }
        if (matchedZone.freeDeliveryPolicy === delivery_config_schema_1.FreeDeliveryPolicy.MIN_ORDER_AMOUNT &&
            matchedZone.minOrderForFreeDelivery &&
            subTotal >= matchedZone.minOrderForFreeDelivery) {
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
    async updateGlobalConfig(dto) {
        const config = await this.getOrCreateConfig();
        if (dto.defaultFee !== undefined)
            config.defaultFee = dto.defaultFee;
        if (dto.enableGlobalFreeDelivery !== undefined) {
            config.enableGlobalFreeDelivery = dto.enableGlobalFreeDelivery;
        }
        if (dto.globalFreeDeliveryMinOrder !== undefined) {
            config.globalFreeDeliveryMinOrder = dto.globalFreeDeliveryMinOrder;
        }
        return config.save();
    }
    async addZone(dto) {
        const config = await this.getOrCreateConfig();
        const exists = (config.zones || []).some((z) => z.code.toUpperCase() === dto.code.trim().toUpperCase());
        if (exists) {
            throw new common_1.BadRequestException(`Zone with code '${dto.code}' already exists`);
        }
        if (dto.isDefault) {
            config.zones.forEach((z) => {
                z.isDefault = false;
            });
        }
        const newZone = {
            _id: new mongoose_2.Types.ObjectId(),
            name: dto.name.trim(),
            code: dto.code.trim().toUpperCase(),
            deliveryFee: dto.deliveryFee,
            isDefault: Boolean(dto.isDefault),
            isActive: dto.isActive !== undefined ? dto.isActive : true,
            matchedCities: (dto.matchedCities || []).map((c) => c.trim()).filter(Boolean),
            freeDeliveryPolicy: dto.freeDeliveryPolicy || delivery_config_schema_1.FreeDeliveryPolicy.NONE,
            minOrderForFreeDelivery: dto.minOrderForFreeDelivery ?? null,
            estimatedDays: dto.estimatedDays?.trim() || '',
        };
        config.zones.push(newZone);
        return config.save();
    }
    async updateZone(zoneId, dto) {
        const config = await this.getOrCreateConfig();
        const zoneIndex = config.zones.findIndex((z) => z._id.toString() === zoneId);
        if (zoneIndex === -1) {
            throw new common_1.NotFoundException(`Delivery zone not found`);
        }
        if (dto.isDefault) {
            config.zones.forEach((z) => {
                z.isDefault = false;
            });
        }
        const zone = config.zones[zoneIndex];
        if (dto.name !== undefined)
            zone.name = dto.name.trim();
        if (dto.code !== undefined)
            zone.code = dto.code.trim().toUpperCase();
        if (dto.deliveryFee !== undefined)
            zone.deliveryFee = dto.deliveryFee;
        if (dto.isDefault !== undefined)
            zone.isDefault = dto.isDefault;
        if (dto.isActive !== undefined)
            zone.isActive = dto.isActive;
        if (dto.matchedCities !== undefined) {
            zone.matchedCities = dto.matchedCities.map((c) => c.trim()).filter(Boolean);
        }
        if (dto.freeDeliveryPolicy !== undefined)
            zone.freeDeliveryPolicy = dto.freeDeliveryPolicy;
        if (dto.minOrderForFreeDelivery !== undefined) {
            zone.minOrderForFreeDelivery = dto.minOrderForFreeDelivery;
        }
        if (dto.estimatedDays !== undefined)
            zone.estimatedDays = dto.estimatedDays.trim();
        config.markModified('zones');
        return config.save();
    }
    async deleteZone(zoneId) {
        const config = await this.getOrCreateConfig();
        const zoneIndex = config.zones.findIndex((z) => z._id.toString() === zoneId);
        if (zoneIndex === -1) {
            throw new common_1.NotFoundException(`Delivery zone not found`);
        }
        if (config.zones.length <= 1) {
            throw new common_1.BadRequestException('Cannot delete the last remaining delivery zone');
        }
        config.zones.splice(zoneIndex, 1);
        if (!config.zones.some((z) => z.isDefault)) {
            config.zones[0].isDefault = true;
        }
        config.markModified('zones');
        return config.save();
    }
};
exports.DeliveryConfigService = DeliveryConfigService;
exports.DeliveryConfigService = DeliveryConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(delivery_config_schema_1.DeliveryConfig.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DeliveryConfigService);
//# sourceMappingURL=delivery-config.service.js.map