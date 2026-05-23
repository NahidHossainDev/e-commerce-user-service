import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminCmsComponentsController } from './admin-components.controller';
import { CmsComponentsRepository } from './components.repository';
import { CmsComponentsService } from './components.service';
import { CmsComponent, CmsComponentSchema } from './schemas/component.schema';
import { ComponentValidationService } from './validation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CmsComponent.name, schema: CmsComponentSchema },
    ]),
  ],
  controllers: [AdminCmsComponentsController],
  providers: [
    CmsComponentsService,
    CmsComponentsRepository,
    ComponentValidationService,
  ],
  exports: [CmsComponentsService, MongooseModule],
})
export class CmsComponentsModule {}
