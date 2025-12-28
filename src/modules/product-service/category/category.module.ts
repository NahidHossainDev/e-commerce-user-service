import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import {
  AdminCategoryController,
  PublicCategoryController,
} from './controller';
import { Category, CategorySchema } from './schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [AdminCategoryController, PublicCategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
