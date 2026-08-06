import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    example: 'current-password',
    description: 'Current user password',
  })
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  @ApiProperty({
    type: String,
    required: true,
    example: 'new-secure-password',
    description: 'New password (minimum 6 characters)',
  })
  newPassword: string;
}
