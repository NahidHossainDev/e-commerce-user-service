import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminDeliveryConfigController } from './controller/admin-delivery-config.controller';
import { DeliveryConfigController } from './controller/delivery-config.controller';
import { DeliveryConfigService } from './delivery-config.service';
import {
  DeliveryConfig,
  DeliveryConfigSchema,
} from './schemas/delivery-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeliveryConfig.name, schema: DeliveryConfigSchema },
    ]),
  ],
  controllers: [AdminDeliveryConfigController, DeliveryConfigController],
  providers: [DeliveryConfigService],
  exports: [DeliveryConfigService],
})
export class DeliveryConfigModule {}
