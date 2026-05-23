import { Module } from '@nestjs/common';
import { CmsComponentsModule } from './components/components.module';
import { CmsPagesModule } from './pages/pages.module';

@Module({
  imports: [CmsPagesModule, CmsComponentsModule],
  exports: [CmsPagesModule, CmsComponentsModule],
})
export class CmsModule {}
