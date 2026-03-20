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
exports.ProductEventsController = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const constants_1 = require("../../../common/constants");
const product_events_1 = require("../../../common/events/product.events");
const product_service_1 = require("./product.service");
const product_schema_1 = require("./schemas/product.schema");
let ProductEventsController = class ProductEventsController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    async handleCheckAvailability(payload) {
        const product = await this.productService.findOneAdmin(payload.productId);
        if (!product || product.status !== product_schema_1.ProductStatus.ACTIVE) {
            return new product_events_1.ProductAvailabilityResult({
                productId: payload.productId,
                isAvailable: false,
                price: {
                    basePrice: 0,
                    discountPrice: 0,
                    discountRate: 0,
                    currency: constants_1.DEFAULT_CURRENCY,
                },
                title: '',
                thumbnail: '',
                availableStock: 0,
                error: 'Product not found or inactive',
            });
        }
        if (payload.variantSku) {
            const variant = product.variants.find((v) => v.sku === payload.variantSku);
            if (!variant) {
                return new product_events_1.ProductAvailabilityResult({
                    productId: payload.productId,
                    isAvailable: false,
                    price: {
                        basePrice: 0,
                        discountPrice: 0,
                        discountRate: 0,
                        currency: constants_1.DEFAULT_CURRENCY,
                    },
                    title: product.title,
                    thumbnail: product.thumbnail,
                    availableStock: 0,
                    error: 'Variant not found',
                });
            }
            if (variant.stock < payload.quantity) {
                return new product_events_1.ProductAvailabilityResult({
                    productId: payload.productId,
                    isAvailable: false,
                    price: {
                        ...product.price,
                        basePrice: variant.additionalPrice
                            ? product.price.basePrice + variant.additionalPrice
                            : product.price.basePrice,
                    },
                    title: product.title,
                    thumbnail: product.thumbnail,
                    availableStock: variant.stock,
                    error: 'Not enough stock for variant',
                    variantSku: payload.variantSku,
                });
            }
            return new product_events_1.ProductAvailabilityResult({
                productId: payload.productId,
                isAvailable: true,
                price: {
                    ...product.price,
                    basePrice: variant.additionalPrice
                        ? product.price.basePrice + variant.additionalPrice
                        : product.price.basePrice,
                },
                title: product.title,
                thumbnail: product.thumbnail,
                availableStock: variant.stock,
                variantSku: payload.variantSku,
            });
        }
        if (product.stock < payload.quantity) {
            return new product_events_1.ProductAvailabilityResult({
                productId: payload.productId,
                isAvailable: false,
                price: product.price,
                title: product.title,
                thumbnail: product.thumbnail,
                availableStock: product.stock,
                error: 'Not enough stock',
            });
        }
        return new product_events_1.ProductAvailabilityResult({
            productId: payload.productId,
            isAvailable: true,
            price: product.price,
            title: product.title,
            thumbnail: product.thumbnail,
            availableStock: product.stock,
        });
    }
};
exports.ProductEventsController = ProductEventsController;
__decorate([
    (0, event_emitter_1.OnEvent)(product_events_1.ProductEvents.CHECK_AVAILABILITY),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_events_1.ProductCheckAvailabilityEvent]),
    __metadata("design:returntype", Promise)
], ProductEventsController.prototype, "handleCheckAvailability", null);
exports.ProductEventsController = ProductEventsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductEventsController);
//# sourceMappingURL=product.events.controller.js.map