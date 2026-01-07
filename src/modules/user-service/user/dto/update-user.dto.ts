import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { AccountStatus } from '../user.schema';
import {
  CreateProfileDto,
  CreateRoleDto,
  CreateUserDto,
} from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(AccountStatus)
  @ApiProperty({
    type: String,
    enum: AccountStatus,
    example: AccountStatus.PENDING_VERIFICATION,
  })
  accountStatus?: AccountStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoleDto)
  roles?: CreateRoleDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile?: CreateProfileDto;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ type: Boolean, example: false })
  isDeleted?: boolean;
}
