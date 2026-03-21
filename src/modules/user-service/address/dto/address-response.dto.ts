import { ApiProperty } from '@nestjs/swagger';
import { AddressType } from '../address.schema';

export class AddressResponseDto {
  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d0e1' })
  _id: any;

  @ApiProperty({ example: '64b1f2c3d4e5f6a7b8c9d012' })
  userId: any;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: '+8801700000000' })
  phoneNumber: string;

  @ApiProperty({ enum: AddressType, example: AddressType.HOME })
  type: AddressType;

  @ApiProperty({ example: '123 Street' })
  street: string;

  @ApiProperty({ example: 'Dhaka' })
  city: string;

  @ApiProperty({ example: 'Dhaka' })
  state: string;

  @ApiProperty({ example: '1212' })
  postalCode: string;

  @ApiProperty({ example: 'Bangladesh' })
  country: string;

  @ApiProperty({ example: true })
  isDefault: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class AddressMessageResponseDto {
  @ApiProperty({ example: 'Address deleted successfully' })
  message: string;
}
