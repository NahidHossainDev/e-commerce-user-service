import { AccountStatus } from '../user.schema';
import { CreateProfileDto, CreateRoleDto, CreateUserDto } from './create-user.dto';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    accountStatus?: AccountStatus;
    roles?: CreateRoleDto[];
    profile?: CreateProfileDto;
    isDeleted?: boolean;
}
export {};
