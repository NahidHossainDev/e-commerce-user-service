import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus, UserRole } from '../../user/user.schema';

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------

export class UserProfileDto {
  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  avatarUrl?: string;
}

export class SanitizedUserDto {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  _id: any;

  @ApiProperty({ example: 'user@example.com', required: false })
  email?: string;

  @ApiProperty({ example: '+8801700000000', required: false })
  phoneNumber?: string;

  @ApiProperty({ type: UserProfileDto })
  profile: UserProfileDto;

  @ApiProperty({ isArray: true })
  roles: any[];

  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
  primaryRole: UserRole;

  @ApiProperty({ enum: AccountStatus, example: AccountStatus.ACTIVE })
  accountStatus: AccountStatus;
}

// ---------------------------------------------------------------------------
// Auth token responses (login / phone-verify / social / refresh)
// ---------------------------------------------------------------------------

export class AuthTokensResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Short-lived JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Long-lived JWT refresh token (7 days)',
  })
  refreshToken: string;
}

export class AuthResponseDto extends AuthTokensResponseDto {
  @ApiProperty({ type: SanitizedUserDto })
  user: SanitizedUserDto;
}

// ---------------------------------------------------------------------------
// Simple message response (register / verify-email / resend / phone/start …)
// ---------------------------------------------------------------------------

export class MessageResponseDto {
  @ApiProperty({
    example: 'We sent you a verification email. Please verify to continue.',
  })
  message: string;
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export class LogoutResponseDto {
  @ApiProperty({ example: true })
  acknowledged: boolean;

  @ApiProperty({ example: 1 })
  modifiedCount: number;
}
