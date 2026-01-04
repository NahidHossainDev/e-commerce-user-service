import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config, Config } from './config';
import { CommunicationServiceModule } from './modules/communication-service/communication-service.module';
import { MediaModule } from './modules/media/media.module';
import { OrderServiceModule } from './modules/order-service/order-service.module';
import { PaymentServiceModule } from './modules/payment-service/payment-service.module';
import { ProductServiceModule } from './modules/product-service/product-service.module';
import { UserServiceModule } from './modules/user-service/user-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<Config>) => ({
        uri: configService.getOrThrow<string>('dbURL'),
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      global: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

    // Domain Services
    UserServiceModule,
    ProductServiceModule,
    OrderServiceModule,
    CommunicationServiceModule,
    PaymentServiceModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
