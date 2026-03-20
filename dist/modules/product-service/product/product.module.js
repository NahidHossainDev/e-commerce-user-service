"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const inventory_module_1 = require("../inventory/inventory.module");
const admin_product_controller_1 = require("./controller/admin-product.controller");
const product_controller_1 = require("./product.controller");
const product_events_controller_1 = require("./product.events.controller");
const product_service_1 = require("./product.service");
const product_schema_1 = require("./schemas/product.schema");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema }]),
            inventory_module_1.InventoryModule,
        ],
        controllers: [
            product_controller_1.ProductController,
            admin_product_controller_1.AdminProductController,
            product_events_controller_1.ProductEventsController,
        ],
        providers: [product_service_1.ProductService],
        exports: [product_service_1.ProductService, mongoose_1.MongooseModule],
    })
], ProductModule);
//# sourceMappingURL=product.module.js.map