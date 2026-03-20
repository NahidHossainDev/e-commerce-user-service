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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_events_1 = require("../../../common/events/user.events");
const address_schema_1 = require("./address.schema");
let AddressService = class AddressService {
    addressModel;
    constructor(addressModel) {
        this.addressModel = addressModel;
    }
    async create(createAddressDto) {
        const count = await this.addressModel.countDocuments({
            userId: createAddressDto.userId,
        });
        if (count >= 5) {
            throw new common_1.BadRequestException('Maximum 5 addresses allowed per user');
        }
        return this.addressModel.create(createAddressDto);
    }
    async findAllByUser(userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }
        const addresses = await this.addressModel
            .find({ userId })
            .sort({ isDefault: -1 })
            .exec();
        return addresses;
    }
    async findOne(id) {
        const address = await this.addressModel.findById(id).exec();
        if (!address)
            throw new Error('Address not found');
        return address;
    }
    async update(id, updateAddressDto) {
        const updated = await this.addressModel.findByIdAndUpdate(id, updateAddressDto, {
            new: true,
        });
        if (!updated)
            throw new Error('Address not found');
        return updated;
    }
    async remove(id) {
        const deleted = await this.addressModel.findByIdAndDelete(id);
        if (!deleted)
            throw new Error('Address not found');
        return { message: 'Address deleted successfully' };
    }
    async setDefaultAddress(userId, addressId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId) || !mongoose_2.Types.ObjectId.isValid(addressId)) {
            throw new Error('Invalid user ID or address ID');
        }
        await this.addressModel.updateMany({ userId: userId, isDefault: true }, { isDefault: false });
        const updated = await this.addressModel.findByIdAndUpdate(addressId, { isDefault: true }, { new: true });
        if (!updated)
            throw new Error('Address not found');
        return updated;
    }
    async validateAddressOwnership(payload) {
        const address = await this.addressModel.findById(payload.addressId);
        if (!address) {
            return { isValid: false, error: 'Address not found' };
        }
        if (address.userId.toString() !== payload.userId) {
            return { isValid: false, error: 'Address does not belong to user' };
        }
        return { isValid: true };
    }
};
exports.AddressService = AddressService;
__decorate([
    (0, event_emitter_1.OnEvent)(user_events_1.UserEvents.VALIDATE_ADDRESS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_events_1.AddressValidateEvent]),
    __metadata("design:returntype", Promise)
], AddressService.prototype, "validateAddressOwnership", null);
exports.AddressService = AddressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(address_schema_1.Address.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AddressService);
//# sourceMappingURL=address.service.js.map