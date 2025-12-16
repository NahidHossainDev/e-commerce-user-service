import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AddressModule } from './address/address.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { config } from './config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.dbURL),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    UserModule,
    AddressModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
