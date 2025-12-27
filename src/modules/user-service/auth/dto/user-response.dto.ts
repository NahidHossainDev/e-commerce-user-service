import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AccountStatus, UserRole } from 'src/modules/user-service/user/user.schema';

@Exclude()
export class AuthUserResponseDto {
  @Expose()
  @ApiProperty()
  _id: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  phoneNumber: string;

  @Expose()
  @ApiProperty()
  profile: any; // Ideally define a ProfileDto

  @Expose()
  @ApiProperty()
  roles: any[]; // Ideally RoleDto

  @Expose()
  @ApiProperty()
  primaryRole: UserRole;

  @Expose()
  @ApiProperty()
  accountStatus: AccountStatus;

  constructor(partial: Partial<AuthUserResponseDto>) {
    Object.assign(this, partial);
  }
}
