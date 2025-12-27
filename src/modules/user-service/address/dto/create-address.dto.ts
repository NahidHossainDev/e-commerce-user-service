import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { AddressType } from '../address.schema';

export class CreateAddressDto {
  @ApiProperty({
    type: String,
    example: '6741fcb913bdffb52f8f945e',
    description: 'ID of the user who owns this address',
  })
  @IsNotEmpty()
  @IsString()
  userId: string; // Accept string; convert to ObjectId in service if needed

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the address owner',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: '+8801712345678',
    description: 'Contact phone number',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('BD')
  phoneNumber: string;

  @ApiProperty({
    enum: AddressType,
    example: AddressType.HOME,
    description: 'Type of address',
  })
  @IsEnum(AddressType)
  type: AddressType;

  @ApiProperty({
    example: '123 Main Street',
    description: 'Street address line',
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    example: 'Dhaka',
    description: 'City name',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: 'Dhaka Division',
    description: 'State or province name',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    example: '1207',
    description: 'Postal or ZIP code',
  })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({
    example: 'Bangladesh',
    description: 'Country name',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    example: false,
    description: 'Whether this is the default address',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
