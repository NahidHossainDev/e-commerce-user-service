import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryModule } from '../inventory/inventory.module';
import { ProductController } from './product.controller';
import { ProductEventsController } from './product.events.controller';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    InventoryModule,
  ],
  controllers: [ProductController, ProductEventsController],
  providers: [ProductService],
  exports: [ProductService, MongooseModule],
})
export class ProductModule {}
