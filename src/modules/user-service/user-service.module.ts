import { Module } from '@nestjs/common';
import { AddressModule } from './address/address.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule, AddressModule],
  exports: [AuthModule, UserModule, AddressModule],
})
export class UserServiceModule {}
