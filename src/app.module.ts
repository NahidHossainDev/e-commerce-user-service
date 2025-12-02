import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressModule } from './address/address.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongooseModule.forRoot(config.dbURL), UserModule, AddressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
