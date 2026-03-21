import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountStatus, AuthProvider, Gender, UserRole } from '../user.schema';

// ---------------------------------------------------------------------------
// Sub-document DTOs (mirrors the Mongoose schema)
// ---------------------------------------------------------------------------

export class UserProfileResponseDto {
  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiPropertyOptional({ example: 'https://ibb.co/5WHkfvR4' })
  imageUrl?: string;

  @ApiPropertyOptional({ example: '1998-07-21' })
  dateOfBirth?: Date;

  @ApiPropertyOptional({ enum: Gender, example: Gender.MALE })
  gender?: Gender;
}

export class UserRoleResponseDto {
  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
  type: UserRole;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  assignedAt: Date;
}

export class UserVerificationResponseDto {
  @ApiProperty({ example: false })
  emailVerified: boolean;

  @ApiProperty({ example: false })
  phoneVerified: boolean;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
  emailVerifiedAt?: Date;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
  phoneVerifiedAt?: Date;
}

// ---------------------------------------------------------------------------
// Full user document DTO
// (returned by create / findOne / update / remove)
// ---------------------------------------------------------------------------

export class UserResponseDto {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  _id: any;

  @ApiPropertyOptional({ example: 'user@example.com' })
  email?: string;

  @ApiPropertyOptional({ example: '+8801700000000' })
  phoneNumber?: string;

  @ApiProperty({ enum: AuthProvider, example: AuthProvider.LOCAL })
  provider: AuthProvider;

  @ApiPropertyOptional({ example: 'google_sub_id' })
  googleId?: string;

  @ApiPropertyOptional({ example: 'facebook_user_id' })
  facebookId?: string;

  @ApiProperty({ enum: AccountStatus, example: AccountStatus.ACTIVE })
  accountStatus: AccountStatus;

  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
  primaryRole: UserRole;

  @ApiProperty({ type: UserProfileResponseDto })
  profile: UserProfileResponseDto;

  @ApiProperty({ type: [UserRoleResponseDto] })
  roles: UserRoleResponseDto[];

  @ApiProperty({ type: UserVerificationResponseDto })
  verification: UserVerificationResponseDto;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Pagination meta DTO
// ---------------------------------------------------------------------------

export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  totalCount: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 2, nullable: true })
  nextPage: number | null;
}

// ---------------------------------------------------------------------------
// Paginated users list DTO
// (returned by findAll)
// ---------------------------------------------------------------------------

export class PaginatedUsersResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
