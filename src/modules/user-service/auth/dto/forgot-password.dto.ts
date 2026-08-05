import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address associated with the account',
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset JWT token received in email',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    example: 'newSecurePassword123',
    description: 'New password for the user account',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class VerifyResetTokenDto {
  @ApiProperty({
    description: 'Password reset JWT token received in email',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
