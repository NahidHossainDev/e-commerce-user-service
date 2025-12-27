import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Gender, UserRole } from '../user.schema';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true, example: 'Jone Doe' })
  fullName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, example: 'https://ibb.co/5WHkfvR4' })
  imageUrl?: string;

  @IsOptional()
  @IsDate()
  @Type((): DateConstructor => Date)
  @ApiProperty({ type: String, required: false, example: '1998-07-21' })
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(Gender)
  @ApiProperty({ type: String, example: Gender.MALE })
  gender?: string;
}

export class CreateRoleDto {
  @IsEnum(UserRole)
  @ApiProperty({ type: String, example: UserRole.CUSTOMER })
  type: string;
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, example: 'example@email.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('BD')
  @ApiProperty({ type: String, required: true, example: '+880123456789' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, example: 'secrete-password' })
  password: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoleDto)
  @ApiProperty({
    type: [CreateRoleDto],
    example: [{ type: UserRole.CUSTOMER }],
  })
  roles?: CreateRoleDto[];

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({
    type: String,
    example: UserRole.CUSTOMER,
  })
  primaryRole?: string;

  @ApiProperty({
    type: CreateProfileDto,
    example: {
      fullName: 'John Doe',
      imageUrl: 'https://i.ibb.co/5WHkfvR4/profile.jpg',
      dateOfBirth: '1998-07-21',
      gender: Gender.MALE,
    },
  })
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;
}

// const adminProfile = {
//   department: String,
//   permissions: [String], // Array of permission strings
//   accessLevel: { type: Number, default: 1 }, // 1-10 scale
// };

// const sellerProfile = {
//   businessName: String,
//   businessType: {
//     type: String,
//     enum: ['INDIVIDUAL', 'COMPANY', 'PARTNERSHIP'],
//   },
//   taxId: String,
//   businessLicense: String,
//   businessAddress: {
//     street: String,
//     city: String,
//     state: String,
//     country: String,
//     postalCode: String,
//   },
//   bankDetails: {
//     accountHolderName: String,
//     accountNumber: String, // Encrypted
//     bankName: String,
//     ifscCode: String,
//     swiftCode: String,
//   },
//   verificationDocuments: [
//     {
//       documentType: String,
//       documentUrl: String,
//       verificationStatus: {
//         type: String,
//         enum: ['PENDING', 'APPROVED', 'REJECTED'],
//       },
//       verifiedAt: Date,
//     },
//   ],
//   commission: { type: Number, default: 0 }, // Platform commission percentage
//   rating: { type: Number, default: 0 },
//   totalSales: { type: Number, default: 0 },
// };
