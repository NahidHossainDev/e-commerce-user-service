"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryConfigModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_delivery_config_controller_1 = require("./controller/admin-delivery-config.controller");
const delivery_config_controller_1 = require("./controller/delivery-config.controller");
const delivery_config_service_1 = require("./delivery-config.service");
const delivery_config_schema_1 = require("./schemas/delivery-config.schema");
let DeliveryConfigModule = class DeliveryConfigModule {
};
exports.DeliveryConfigModule = DeliveryConfigModule;
exports.DeliveryConfigModule = DeliveryConfigModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: delivery_config_schema_1.DeliveryConfig.name, schema: delivery_config_schema_1.DeliveryConfigSchema },
            ]),
        ],
        controllers: [admin_delivery_config_controller_1.AdminDeliveryConfigController, delivery_config_controller_1.DeliveryConfigController],
        providers: [delivery_config_service_1.DeliveryConfigService],
        exports: [delivery_config_service_1.DeliveryConfigService],
    })
], DeliveryConfigModule);
//# sourceMappingURL=delivery-config.module.js.map