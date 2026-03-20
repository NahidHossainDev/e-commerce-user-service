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
exports.Price = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const constants_1 = require("../constants");
let Price = class Price {
    basePrice;
    discountPrice;
    discountRate;
    currency;
};
exports.Price = Price;
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0, index: true }),
    __metadata("design:type", Number)
], Price.prototype, "basePrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], Price.prototype, "discountPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, max: 100 }),
    __metadata("design:type", Number)
], Price.prototype, "discountRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: constants_1.AppCurrency, default: constants_1.DEFAULT_CURRENCY }),
    __metadata("design:type", String)
], Price.prototype, "currency", void 0);
exports.Price = Price = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Price);
//# sourceMappingURL=price.schema.js.map