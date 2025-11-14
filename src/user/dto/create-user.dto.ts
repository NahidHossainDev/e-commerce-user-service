import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsDate()
  @Type((): DateConstructor => Date)
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  gender?: string;
}

export class CreateRoleDto {
  @IsEnum(['CUSTOMER', 'SELLER', 'ADMIN', 'SUPER_ADMIN'])
  type: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoleDto)
  roles?: CreateRoleDto[];

  @IsOptional()
  @IsEnum(['CUSTOMER', 'SELLER', 'ADMIN', 'SUPER_ADMIN'])
  primaryRole?: string;

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
