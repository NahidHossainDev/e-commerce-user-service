import { Module } from '@nestjs/common';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { InventoryModule } from './inventory/inventory.module';
import { MediaModule } from './media/media.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { UnitModule } from './unit/unit.module';

@Module({
  imports: [
    ProductModule,
    CategoryModule,
    BrandModule,
    InventoryModule,
    ReviewModule,
    MediaModule,
    UnitModule,
  ],
  exports: [
    ProductModule,
    CategoryModule,
    BrandModule,
    InventoryModule,
    ReviewModule,
    MediaModule,
    UnitModule,
  ],
})
export class ProductServiceModule {}
