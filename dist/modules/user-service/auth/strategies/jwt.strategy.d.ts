import { UserService } from 'src/modules/user-service/user/user.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(payload: any): Promise<import("mongoose").Document<unknown, {}, import("../../user/user.schema").User, {}, {}> & import("../../user/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
export {};
