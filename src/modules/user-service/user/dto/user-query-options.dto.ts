import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { QueryOptions } from 'src/common/dto/queryOptions.dto';
import { Gender, UserRole } from '../user.schema';

export class UserQueryOptions extends QueryOptions {
  @ApiPropertyOptional({ description: 'Filter by full name or email' })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({ enum: Gender, description: 'Filter by gender' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ enum: UserRole, description: 'Filter by user type' })
  @IsOptional()
  @IsEnum(UserRole)
  userRole?: UserRole;
}
