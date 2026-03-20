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
exports.AddressSchema = exports.Address = exports.AddressType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var AddressType;
(function (AddressType) {
    AddressType["HOME"] = "HOME";
    AddressType["WORK"] = "WORK";
    AddressType["OFFICE"] = "OFFICE";
    AddressType["OTHER"] = "SUPER_ADMIN";
})(AddressType || (exports.AddressType = AddressType = {}));
let Address = class Address {
    _id;
    userId;
    fullName;
    phoneNumber;
    type;
    street;
    city;
    state;
    postalCode;
    country;
    isDefault;
};
exports.Address = Address;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Address.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Address.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Address.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: AddressType, required: true }),
    __metadata("design:type", String)
], Address.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Address.prototype, "street", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Address.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Address.prototype, "postalCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Address.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Address.prototype, "isDefault", void 0);
exports.Address = Address = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Address);
exports.AddressSchema = mongoose_1.SchemaFactory.createForClass(Address);
//# sourceMappingURL=address.schema.js.map