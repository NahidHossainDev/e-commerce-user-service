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
exports.RatingSummarySchema = exports.RatingSummary = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let RatingDistribution = class RatingDistribution {
    five;
    four;
    three;
    two;
    one;
};
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], RatingDistribution.prototype, "five", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], RatingDistribution.prototype, "four", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], RatingDistribution.prototype, "three", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], RatingDistribution.prototype, "two", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], RatingDistribution.prototype, "one", void 0);
RatingDistribution = __decorate([
    (0, mongoose_1.Schema)()
], RatingDistribution);
let RatingSummary = class RatingSummary {
    productId;
    totalReviews;
    totalRatings;
    averageRating;
    ratingDistribution;
};
exports.RatingSummary = RatingSummary;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Product',
        required: true,
        unique: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], RatingSummary.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], RatingSummary.prototype, "totalReviews", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], RatingSummary.prototype, "totalRatings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0, max: 5 }),
    __metadata("design:type", Number)
], RatingSummary.prototype, "averageRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: RatingDistribution, default: {} }),
    __metadata("design:type", RatingDistribution)
], RatingSummary.prototype, "ratingDistribution", void 0);
exports.RatingSummary = RatingSummary = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], RatingSummary);
exports.RatingSummarySchema = mongoose_1.SchemaFactory.createForClass(RatingSummary);
//# sourceMappingURL=rating-summary.schema.js.map