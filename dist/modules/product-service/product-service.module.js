"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServiceModule = void 0;
const common_1 = require("@nestjs/common");
const brand_module_1 = require("./brand/brand.module");
const category_module_1 = require("./category/category.module");
const inventory_module_1 = require("./inventory/inventory.module");
const product_module_1 = require("./product/product.module");
const review_module_1 = require("./review/review.module");
const unit_module_1 = require("./unit/unit.module");
let ProductServiceModule = class ProductServiceModule {
};
exports.ProductServiceModule = ProductServiceModule;
exports.ProductServiceModule = ProductServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            product_module_1.ProductModule,
            category_module_1.CategoryModule,
            brand_module_1.BrandModule,
            inventory_module_1.InventoryModule,
            review_module_1.ReviewModule,
            unit_module_1.UnitModule,
        ],
        exports: [
            product_module_1.ProductModule,
            category_module_1.CategoryModule,
            brand_module_1.BrandModule,
            inventory_module_1.InventoryModule,
            review_module_1.ReviewModule,
            unit_module_1.UnitModule,
        ],
    })
], ProductServiceModule);
//# sourceMappingURL=product-service.module.js.map