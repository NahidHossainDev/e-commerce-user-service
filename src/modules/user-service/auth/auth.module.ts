import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { config } from 'src/config';
import { UserModule } from 'src/modules/user-service/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModule } from 'src/modules/communication-service/notification/notification.module';
import {
  VerificationToken,
  VerificationTokenSchema,
} from './schemas/verification-token.schema';

@Module({
  imports: [
    UserModule,
    PassportModule,
    NotificationModule,
    MongooseModule.forFeature([
      { name: VerificationToken.name, schema: VerificationTokenSchema },
    ]),
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
