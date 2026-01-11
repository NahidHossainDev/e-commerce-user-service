import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class PhoneStartDto {
  @ApiProperty({
    example: '+8801700000000',
    description: 'Phone number in E.164 format',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;
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
