import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AdjustStockDto,
  CreateInventoryDto,
  UpdateInventoryDto,
} from './dto/inventory.dto';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create inventory for a product' })
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get inventory by product ID' })
  findByProductId(@Param('productId') productId: string) {
    return this.inventoryService.findByProductId(productId);
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Update inventory settings by product ID' })
  update(
    @Param('productId') productId: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(productId, updateInventoryDto);
  }

  @Post(':productId/adjust')
  @ApiOperation({ summary: 'Adjust stock quantity' })
  adjustStock(
    @Param('productId') productId: string,
    @Body() adjustStockDto: AdjustStockDto,
  ) {
    return this.inventoryService.adjustStock(productId, adjustStockDto);
  }

  @Get(':productId/history')
  @ApiOperation({ summary: 'Get inventory history for a product' })
  getHistory(@Param('productId') productId: string) {
    return this.inventoryService.getHistory(productId);
  }
}
