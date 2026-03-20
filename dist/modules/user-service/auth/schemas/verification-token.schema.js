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
exports.VerificationTokenSchema = exports.VerificationToken = exports.VerificationTokenType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var VerificationTokenType;
(function (VerificationTokenType) {
    VerificationTokenType["EMAIL_VERIFICATION"] = "EMAIL_VERIFICATION";
    VerificationTokenType["PASSWORD_RESET"] = "PASSWORD_RESET";
})(VerificationTokenType || (exports.VerificationTokenType = VerificationTokenType = {}));
let VerificationToken = class VerificationToken {
    userId;
    tokenHash;
    type;
    expiresAt;
    used;
};
exports.VerificationToken = VerificationToken;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], VerificationToken.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], VerificationToken.prototype, "tokenHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: VerificationTokenType,
        default: VerificationTokenType.EMAIL_VERIFICATION,
    }),
    __metadata("design:type", String)
], VerificationToken.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], VerificationToken.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], VerificationToken.prototype, "used", void 0);
exports.VerificationToken = VerificationToken = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], VerificationToken);
exports.VerificationTokenSchema = mongoose_1.SchemaFactory.createForClass(VerificationToken);
exports.VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.VerificationTokenSchema.index({ userId: 1, type: 1 });
//# sourceMappingURL=verification-token.schema.js.map