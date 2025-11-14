import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import {
  CreateProfileDto,
  CreateRoleDto,
  CreateUserDto,
} from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLOCKED', 'DELETED', 'PENDING'])
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
  isDeleted?: boolean;
}
