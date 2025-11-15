import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { RoleStatus } from '../user.schema';
import {
  CreateProfileDto,
  CreateRoleDto,
  CreateUserDto,
} from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(RoleStatus)
  @ApiProperty({ type: String, example: RoleStatus.ACTIVE })
  accountStatus?: string;

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
