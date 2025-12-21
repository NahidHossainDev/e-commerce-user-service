import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductInventoryHistory, ProductInventoryHistorySchema } from './schemas/inventory-history.schema';
import { ProductInventory, ProductInventorySchema } from './schemas/inventory.schema';
import { ProductMedia, ProductMediaSchema } from './schemas/media.schema';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      { name: ProductInventory.name, schema: ProductInventorySchema },
      { name: ProductInventoryHistory.name, schema: ProductInventoryHistorySchema },
      { name: ProductMedia.name, schema: ProductMediaSchema },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [MongooseModule],
})
export class ProductModule {}
