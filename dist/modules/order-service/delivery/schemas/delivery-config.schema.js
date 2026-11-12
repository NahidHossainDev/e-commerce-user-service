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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryConfigSchema = exports.DeliveryConfig = exports.DeliveryZoneSchema = exports.DeliveryZone = exports.FreeDeliveryPolicy = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var FreeDeliveryPolicy;
(function (FreeDeliveryPolicy) {
    FreeDeliveryPolicy["NONE"] = "NONE";
    FreeDeliveryPolicy["MIN_ORDER_AMOUNT"] = "MIN_ORDER_AMOUNT";
    FreeDeliveryPolicy["ALWAYS_FREE"] = "ALWAYS_FREE";
})(FreeDeliveryPolicy || (exports.FreeDeliveryPolicy = FreeDeliveryPolicy = {}));
let DeliveryZone = class DeliveryZone {
    _id;
    name;
    code;
    deliveryFee;
    isDefault;
    isActive;
    matchedCities;
    freeDeliveryPolicy;
    minOrderForFreeDelivery;
    estimatedDays;
};
exports.DeliveryZone = DeliveryZone;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], DeliveryZone.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, uppercase: true, trim: true }),
    __metadata("design:type", String)
], DeliveryZone.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], DeliveryZone.prototype, "deliveryFee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], DeliveryZone.prototype, "isDefault", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], DeliveryZone.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], DeliveryZone.prototype, "matchedCities", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: FreeDeliveryPolicy,
        default: FreeDeliveryPolicy.NONE,
    }),
    __metadata("design:type", String)
], DeliveryZone.prototype, "freeDeliveryPolicy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0, default: null }),
    __metadata("design:type", Object)
], DeliveryZone.prototype, "minOrderForFreeDelivery", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], DeliveryZone.prototype, "estimatedDays", void 0);
exports.DeliveryZone = DeliveryZone = __decorate([
    (0, mongoose_1.Schema)({ _id: true, timestamps: false })
], DeliveryZone);
exports.DeliveryZoneSchema = mongoose_1.SchemaFactory.createForClass(DeliveryZone);
let DeliveryConfig = class DeliveryConfig {
    _id;
    defaultFee;
    enableGlobalFreeDelivery;
    globalFreeDeliveryMinOrder;
    zones;
};
exports.DeliveryConfig = DeliveryConfig;
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0, default: 60 }),
    __metadata("design:type", Number)
], DeliveryConfig.prototype, "defaultFee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], DeliveryConfig.prototype, "enableGlobalFreeDelivery", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, min: 0, default: null }),
    __metadata("design:type", Object)
], DeliveryConfig.prototype, "globalFreeDeliveryMinOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.DeliveryZoneSchema], default: [] }),
    __metadata("design:type", Array)
], DeliveryConfig.prototype, "zones", void 0);
exports.DeliveryConfig = DeliveryConfig = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'delivery_configs' })
], DeliveryConfig);
exports.DeliveryConfigSchema = mongoose_1.SchemaFactory.createForClass(DeliveryConfig);
//# sourceMappingURL=delivery-config.schema.js.map