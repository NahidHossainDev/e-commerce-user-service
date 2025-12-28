import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import {
  ProductInventoryHistory,
  ProductInventoryHistorySchema,
} from './schemas/inventory-history.schema';
import {
  ProductInventory,
  ProductInventorySchema,
} from './schemas/inventory.schema';

import { Product, ProductSchema } from '../product/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductInventory.name, schema: ProductInventorySchema },
      {
        name: ProductInventoryHistory.name,
        schema: ProductInventoryHistorySchema,
      },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService, MongooseModule],
})
export class InventoryModule {}
