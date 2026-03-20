import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryOptions } from './dto/user-query-options.dto';
import { User, UserDocument } from './user.schema';
export declare class UserService {
    private readonly userModel;
    private readonly eventEmitter;
    constructor(userModel: Model<UserDocument>, eventEmitter: EventEmitter2);
    create(payload: CreateUserDto): Promise<UserDocument>;
    findAll(query: UserQueryOptions): Promise<import("../../../common/interface").IPaginatedResponse<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    findOne(id: string, includeSensitive?: boolean): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findByEmail(email: string, includeSensitive?: boolean): Promise<UserDocument | null>;
    findByPhoneNumber(phoneNumber: string, includeSensitive?: boolean): Promise<UserDocument | null>;
    findByGoogleId(googleId: string): Promise<UserDocument | null>;
    findByFacebookId(facebookId: string): Promise<UserDocument | null>;
    updateRefreshToken(userId: string, hashedToken: string | null): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    updateSecurity(userId: string, securityUpdates: Partial<User['security']>): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
