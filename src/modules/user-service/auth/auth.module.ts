import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { config } from 'src/config';
import { UserModule } from 'src/modules/user-service/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import { NotificationModule } from 'src/modules/communication-service/notification/notification.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    NotificationModule,
    JwtModule.register({
      secret: config.jwtSecretKey,
      signOptions: { expiresIn: config.jwtExpire as any },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
