"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const order_schema_1 = require("../order/schemas/order.schema");
const controller_1 = require("./controller");
const refund_service_1 = require("./refund.service");
const refund_schema_1 = require("./schemas/refund.schema");
let RefundModule = class RefundModule {
};
exports.RefundModule = RefundModule;
exports.RefundModule = RefundModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: refund_schema_1.Refund.name, schema: refund_schema_1.RefundSchema },
                { name: order_schema_1.Order.name, schema: order_schema_1.OrderSchema },
            ]),
        ],
        controllers: [controller_1.RefundController, controller_1.AdminRefundController],
        providers: [refund_service_1.RefundService],
        exports: [refund_service_1.RefundService],
    })
], RefundModule);
//# sourceMappingURL=refund.module.js.map