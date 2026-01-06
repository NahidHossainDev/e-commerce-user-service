import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ description: 'The raw verification token sent to email' })
  @IsNotEmpty()
  @IsString()
  @MinLength(32)
  token: string;
}
