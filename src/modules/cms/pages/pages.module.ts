import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CmsComponentsModule } from '../components/components.module';
import { AdminCmsPagesController } from './admin-pages.controller';
import { CmsPagesController } from './pages.controller';
import { CmsPagesRepository } from './pages.repository';
import { CmsPagesService } from './pages.service';
import { CmsPage, CmsPageSchema } from './schemas/page.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CmsPage.name, schema: CmsPageSchema }]),
    CmsComponentsModule, // Decoupled one-way module dependency
  ],
  controllers: [CmsPagesController, AdminCmsPagesController],
  providers: [CmsPagesService, CmsPagesRepository],
  exports: [CmsPagesService, MongooseModule],
})
export class CmsPagesModule {}
