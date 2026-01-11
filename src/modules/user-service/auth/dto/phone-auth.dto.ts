import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class PhoneStartDto {
  @ApiProperty({
    example: '+8801700000000',
    description: 'Phone number in E.164 format',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid E.164 phone number' })
  phoneNumber: string;

  // Honeypot field - should be empty
  @IsOptional()
  @ValidateIf((o) => o.bot_field)
  @Matches(/^$/, { message: 'Bots not allowed' })
  bot_field?: string;
}

export class PhoneVerifyDto {
  @ApiProperty({ example: '+8801700000000' })
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;
}

export class PhoneResendDto {
  @ApiProperty({ example: '+8801700000000' })
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;
}
