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
exports.DeliveryConfigController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const delivery_config_service_1 = require("../delivery-config.service");
const delivery_config_dto_1 = require("../dto/delivery-config.dto");
let DeliveryConfigController = class DeliveryConfigController {
    deliveryConfigService;
    constructor(deliveryConfigService) {
        this.deliveryConfigService = deliveryConfigService;
    }
    async getPublicConfig() {
        const config = await this.deliveryConfigService.getOrCreateConfig();
        return {
            defaultFee: config.defaultFee,
            enableGlobalFreeDelivery: config.enableGlobalFreeDelivery,
            globalFreeDeliveryMinOrder: config.globalFreeDeliveryMinOrder,
            zones: (config.zones || [])
                .filter((z) => z.isActive)
                .map((z) => ({
                _id: z._id,
                name: z.name,
                code: z.code,
                deliveryFee: z.deliveryFee,
                isDefault: z.isDefault,
                matchedCities: z.matchedCities,
                freeDeliveryPolicy: z.freeDeliveryPolicy,
                minOrderForFreeDelivery: z.minOrderForFreeDelivery,
                estimatedDays: z.estimatedDays,
            })),
        };
    }
    async calculateFee(dto) {
        return this.deliveryConfigService.calculateDeliveryFee(dto.subTotal, dto.city, dto.couponCode ? { discountType: dto.couponCode } : undefined);
    }
};
exports.DeliveryConfigController = DeliveryConfigController;
__decorate([
    (0, common_1.Get)('public'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active delivery configuration and zones for storefront' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeliveryConfigController.prototype, "getPublicConfig", null);
__decorate([
    (0, common_1.Post)('calculate'),
    (0, swagger_1.ApiOperation)({ summary: 'Preview delivery fee calculation for given cart subtotal and city' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delivery_config_dto_1.CalculateDeliveryFeeDto]),
    __metadata("design:returntype", Promise)
], DeliveryConfigController.prototype, "calculateFee", null);
exports.DeliveryConfigController = DeliveryConfigController = __decorate([
    (0, swagger_1.ApiTags)('Delivery Configuration'),
    (0, common_1.Controller)('delivery-config'),
    __metadata("design:paramtypes", [delivery_config_service_1.DeliveryConfigService])
], DeliveryConfigController);
//# sourceMappingURL=delivery-config.controller.js.map