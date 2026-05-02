import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandModule } from '../brand/brand.module';
import { CategoryModule } from '../category/category.module';
import { InventoryModule } from '../inventory/inventory.module';
import { AdminProductController } from './controller/admin-product.controller';
import { ProductController } from './product.controller';
import { ProductEventsController } from './product.events.controller';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    InventoryModule,
    CategoryModule,
    BrandModule,
  ],
  controllers: [
    ProductController,
    AdminProductController,
    ProductEventsController,
  ],
  providers: [ProductService],
  exports: [ProductService, MongooseModule],
})
export class ProductModule {}
