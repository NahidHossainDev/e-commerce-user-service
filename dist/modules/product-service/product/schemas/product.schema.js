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
exports.ProductSchema = exports.Product = exports.ProductMedia = exports.PerishableInfo = exports.ProductVariant = exports.ProductAttribute = exports.BrandRef = exports.CategoryRef = exports.ProductUnit = exports.ProductMediaType = exports.ProductStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schemas_1 = require("../../../../common/schemas");
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["DRAFT"] = "DRAFT";
    ProductStatus["ACTIVE"] = "ACTIVE";
    ProductStatus["INACTIVE"] = "INACTIVE";
    ProductStatus["OUT_OF_STOCK"] = "OUT_OF_STOCK";
    ProductStatus["COMING_SOON"] = "COMING_SOON";
    ProductStatus["DISCONTINUED"] = "DISCONTINUED";
    ProductStatus["ARCHIVED"] = "ARCHIVED";
    ProductStatus["BLOCKED"] = "BLOCKED";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var ProductMediaType;
(function (ProductMediaType) {
    ProductMediaType["IMAGE"] = "IMAGE";
    ProductMediaType["VIDEO"] = "VIDEO";
})(ProductMediaType || (exports.ProductMediaType = ProductMediaType = {}));
let ProductUnit = class ProductUnit {
    unitId;
    value;
    symbol;
};
exports.ProductUnit = ProductUnit;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Unit', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProductUnit.prototype, "unitId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], ProductUnit.prototype, "value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductUnit.prototype, "symbol", void 0);
exports.ProductUnit = ProductUnit = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ProductUnit);
let CategoryRef = class CategoryRef {
    id;
    name;
};
exports.CategoryRef = CategoryRef;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Category', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CategoryRef.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CategoryRef.prototype, "name", void 0);
exports.CategoryRef = CategoryRef = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], CategoryRef);
let BrandRef = class BrandRef {
    id;
    name;
};
exports.BrandRef = BrandRef;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Brand', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BrandRef.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BrandRef.prototype, "name", void 0);
exports.BrandRef = BrandRef = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], BrandRef);
let ProductAttribute = class ProductAttribute {
    name;
    value;
    label;
    unit;
    isFilterable;
    isVisibleOnList;
};
exports.ProductAttribute = ProductAttribute;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductAttribute.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Object }),
    __metadata("design:type", Object)
], ProductAttribute.prototype, "value", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ProductAttribute.prototype, "label", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ProductAttribute.prototype, "unit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ProductAttribute.prototype, "isFilterable", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ProductAttribute.prototype, "isVisibleOnList", void 0);
exports.ProductAttribute = ProductAttribute = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ProductAttribute);
let ProductVariant = class ProductVariant {
    name;
    attributes;
    sku;
    additionalPrice;
    barcode;
    stock;
    isAvailable;
};
exports.ProductVariant = ProductVariant;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "attributes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, sparse: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "additionalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ProductVariant.prototype, "barcode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "stock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "isAvailable", void 0);
exports.ProductVariant = ProductVariant = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ProductVariant);
let PerishableInfo = class PerishableInfo {
    expiryDate;
    manufactureDate;
    batchNumber;
    requiresRefrigeration;
};
exports.PerishableInfo = PerishableInfo;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Date)
], PerishableInfo.prototype, "expiryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], PerishableInfo.prototype, "manufactureDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PerishableInfo.prototype, "batchNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], PerishableInfo.prototype, "requiresRefrigeration", void 0);
exports.PerishableInfo = PerishableInfo = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PerishableInfo);
let ProductMedia = class ProductMedia {
    url;
    altText;
    format;
    type;
};
exports.ProductMedia = ProductMedia;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductMedia.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductMedia.prototype, "altText", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductMedia.prototype, "format", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ProductMediaType }),
    __metadata("design:type", String)
], ProductMedia.prototype, "type", void 0);
exports.ProductMedia = ProductMedia = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ProductMedia);
let Product = class Product {
    title;
    slug;
    description;
    status;
    thumbnail;
    media;
    category;
    subCategories;
    brand;
    vendorId;
    price;
    unit;
    sku;
    barcode;
    stock;
    isInStock;
    variants;
    hasVariants;
    attributes;
    perishableInfo;
    isPerishable;
    tags;
    keywords;
    isBestSeller;
    isFeatured;
    isOnOffer;
    isNew;
    salesCount;
    viewCount;
    averageRating;
    reviewCount;
    dimensions;
    weight;
    metaTitle;
    metaDescription;
    isDeleted;
    deletedAt;
    lastStockSyncAt;
};
exports.Product = Product;
__decorate([
    (0, mongoose_1.Prop)({ required: true, text: true, index: true }),
    __metadata("design:type", String)
], Product.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true, index: true }),
    __metadata("design:type", String)
], Product.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: ProductStatus.DRAFT, enum: ProductStatus, index: true }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "thumbnail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ProductMedia], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "media", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: CategoryRef, required: true }),
    __metadata("design:type", CategoryRef)
], Product.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [CategoryRef], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "subCategories", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BrandRef }),
    __metadata("design:type", BrandRef)
], Product.prototype, "brand", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Vendor', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Product.prototype, "vendorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: schemas_1.Price, required: true }),
    __metadata("design:type", schemas_1.Price)
], Product.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ProductUnit }),
    __metadata("design:type", ProductUnit)
], Product.prototype, "unit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, sparse: true, trim: true, index: true }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, sparse: true, trim: true }),
    __metadata("design:type", String)
], Product.prototype, "barcode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0, default: 0, index: true }),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isInStock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ProductVariant], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "variants", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "hasVariants", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ProductAttribute], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "attributes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PerishableInfo }),
    __metadata("design:type", PerishableInfo)
], Product.prototype, "perishableInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isPerishable", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [], index: true }),
    __metadata("design:type", Array)
], Product.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Product.prototype, "keywords", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isBestSeller", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isFeatured", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isOnOffer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isNew", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, index: true }),
    __metadata("design:type", Number)
], Product.prototype, "salesCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "viewCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0, max: 5, index: true }),
    __metadata("design:type", Number)
], Product.prototype, "averageRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "reviewCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Product.prototype, "dimensions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Product.prototype, "weight", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "metaTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "metaDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isDeleted", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Product.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Product.prototype, "lastStockSyncAt", void 0);
exports.Product = Product = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'products',
    })
], Product);
exports.ProductSchema = mongoose_1.SchemaFactory.createForClass(Product);
exports.ProductSchema.index({ 'category.id': 1, status: 1 });
exports.ProductSchema.index({ 'brand.id': 1, status: 1 });
exports.ProductSchema.index({ 'price.basePrice': 1, status: 1 });
exports.ProductSchema.index({ isFeatured: 1, status: 1, createdAt: -1 });
exports.ProductSchema.index({ isOnOffer: 1, status: 1 });
exports.ProductSchema.index({ tags: 1, status: 1 });
exports.ProductSchema.index({ averageRating: -1, reviewCount: -1, status: 1 });
exports.ProductSchema.index({ stock: 1, status: 1 });
exports.ProductSchema.index({
    title: 'text',
    keywords: 'text',
    tags: 'text',
});
//# sourceMappingURL=product.schema.js.map