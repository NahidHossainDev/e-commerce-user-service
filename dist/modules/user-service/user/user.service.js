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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const constants_1 = require("../../../common/constants");
const media_events_1 = require("../../../common/events/media.events");
const helpers_1 = require("../../../utils/helpers");
const media_helper_1 = require("../../../utils/helpers/media-helper");
const getPaginatedData_1 = require("../../../utils/mongodb/getPaginatedData");
const user_schema_1 = require("./user.schema");
let UserService = class UserService {
    userModel;
    eventEmitter;
    constructor(userModel, eventEmitter) {
        this.userModel = userModel;
        this.eventEmitter = eventEmitter;
    }
    async create(payload) {
        const savedUser = await this.userModel.create(payload);
        if (savedUser.profile?.imageUrl) {
            const mediaId = (0, media_helper_1.extractMediaIdFromUrl)(savedUser.profile.imageUrl);
            if (mediaId) {
                this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_ATTACHED, new media_events_1.ImageAttachedEvent(mediaId, savedUser._id.toString(), 'user'));
            }
        }
        return savedUser;
    }
    async findAll(query) {
        const paginateQueries = (0, helpers_1.pick)(query, constants_1.paginateOptions);
        const filters = (0, helpers_1.pick)(query, ['searchTerm']);
        const pagination = helpers_1.paginationHelpers.calculatePagination(paginateQueries);
        return await (0, getPaginatedData_1.getPaginatedData)({
            model: this.userModel,
            paginationQuery: pagination,
            filterQuery: filters,
        });
    }
    async findOne(id, includeSensitive = false) {
        if (includeSensitive) {
            const user = await this.userModel
                .findById(id)
                .select('+password +security')
                .exec();
            if (!user)
                throw new common_1.NotFoundException('User not found');
            return user;
        }
        const user = await this.userModel.findById(id).exec();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async update(id, updateUserDto) {
        const oldUser = await this.userModel.findById(id);
        if (!oldUser)
            throw new common_1.NotFoundException('User not found');
        const updated = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
            new: true,
        });
        if (!updated)
            throw new common_1.NotFoundException('User not found');
        const oldImageUrl = oldUser.profile?.imageUrl;
        const newImageUrl = updateUserDto.profile?.imageUrl;
        if (newImageUrl && newImageUrl !== oldImageUrl) {
            const oldId = (0, media_helper_1.extractMediaIdFromUrl)(oldImageUrl);
            const newId = (0, media_helper_1.extractMediaIdFromUrl)(newImageUrl);
            const userId = updated._id.toString();
            if (oldId) {
                this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_DETACHED, new media_events_1.ImageDetachedEvent(oldId));
            }
            if (newId) {
                this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_ATTACHED, new media_events_1.ImageAttachedEvent(newId, userId, 'user'));
            }
        }
        return updated;
    }
    async remove(id) {
        const user = await this.userModel.findById(id);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const deleted = await this.userModel.findByIdAndDelete(id);
        if (user.profile?.imageUrl) {
            const mediaId = (0, media_helper_1.extractMediaIdFromUrl)(user.profile.imageUrl);
            if (mediaId) {
                this.eventEmitter.emit(media_events_1.MediaEvent.IMAGE_DETACHED, new media_events_1.ImageDetachedEvent(mediaId));
            }
        }
        return deleted;
    }
    async findByEmail(email, includeSensitive = false) {
        if (includeSensitive) {
            return this.userModel
                .findOne({ email })
                .select('+password +security')
                .exec();
        }
        return this.userModel.findOne({ email }).exec();
    }
    async findByPhoneNumber(phoneNumber, includeSensitive = false) {
        if (includeSensitive) {
            return this.userModel
                .findOne({ phoneNumber })
                .select('+password +security')
                .exec();
        }
        return this.userModel.findOne({ phoneNumber }).exec();
    }
    async findByGoogleId(googleId) {
        return this.userModel.findOne({ googleId });
    }
    async findByFacebookId(facebookId) {
        return this.userModel.findOne({ facebookId });
    }
    async updateRefreshToken(userId, hashedToken) {
        return this.userModel.findByIdAndUpdate(userId, {
            'security.refreshTokenHash': hashedToken,
        });
    }
    async updateSecurity(userId, securityUpdates) {
        const updateQuery = Object.keys(securityUpdates).reduce((acc, key) => {
            acc[`security.${key}`] = securityUpdates[key];
            return acc;
        }, {});
        return this.userModel.findByIdAndUpdate(userId, updateQuery, { new: true });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        event_emitter_1.EventEmitter2])
], UserService);
//# sourceMappingURL=user.service.js.map