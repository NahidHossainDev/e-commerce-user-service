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
exports.CmsComponentSchema = exports.CmsComponent = exports.ComponentSettings = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const component_enum_1 = require("../enums/component.enum");
let ComponentSettings = class ComponentSettings {
    container;
    fullWidth;
    backgroundColor;
    paddingTop;
    paddingBottom;
};
exports.ComponentSettings = ComponentSettings;
__decorate([
    (0, mongoose_1.Prop)({ default: 'boxed' }),
    __metadata("design:type", String)
], ComponentSettings.prototype, "container", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ComponentSettings.prototype, "fullWidth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], ComponentSettings.prototype, "backgroundColor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], ComponentSettings.prototype, "paddingTop", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], ComponentSettings.prototype, "paddingBottom", void 0);
exports.ComponentSettings = ComponentSettings = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ComponentSettings);
let CmsComponent = class CmsComponent {
    pageId;
    componentType;
    order;
    isVisible;
    settings;
    data;
};
exports.CmsComponent = CmsComponent;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CmsComponent.prototype, "pageId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: component_enum_1.CmsComponentType, index: true }),
    __metadata("design:type", String)
], CmsComponent.prototype, "componentType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], CmsComponent.prototype, "order", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true, index: true }),
    __metadata("design:type", Boolean)
], CmsComponent.prototype, "isVisible", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ComponentSettings, default: () => ({}) }),
    __metadata("design:type", ComponentSettings)
], CmsComponent.prototype, "settings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], CmsComponent.prototype, "data", void 0);
exports.CmsComponent = CmsComponent = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'cms-components',
    })
], CmsComponent);
exports.CmsComponentSchema = mongoose_1.SchemaFactory.createForClass(CmsComponent);
exports.CmsComponentSchema.index({ pageId: 1, order: 1 });
exports.CmsComponentSchema.index({ pageId: 1, isVisible: 1, order: 1 });
//# sourceMappingURL=component.schema.js.map