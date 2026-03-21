import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import {
  AdjustStockDto,
  CreateInventoryDto,
  UpdateInventoryDto,
} from './dto/inventory.dto';
import {
  ProductInventoryHistoryResponseDto,
  ProductInventoryResponseDto,
} from './dto/inventory-response.dto';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create inventory for a product' })
  @ApiWrappedResponse({
    status: 201,
    description: 'Inventory created successfully.',
    type: ProductInventoryResponseDto,
  })
  async create(
    @Body() createInventoryDto: CreateInventoryDto,
  ): Promise<ProductInventoryResponseDto> {
    return (await this.inventoryService.create(
      createInventoryDto,
    )) as unknown as ProductInventoryResponseDto;
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get inventory by product ID' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Inventory found.',
    type: ProductInventoryResponseDto,
  })
  async findByProductId(
    @Param('productId') productId: string,
  ): Promise<ProductInventoryResponseDto> {
    return (await this.inventoryService.findByProductId(
      productId,
    )) as unknown as ProductInventoryResponseDto;
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Update inventory settings by product ID' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Inventory updated successfully.',
    type: ProductInventoryResponseDto,
  })
  async update(
    @Param('productId') productId: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<ProductInventoryResponseDto> {
    return (await this.inventoryService.update(
      productId,
      updateInventoryDto,
    )) as unknown as ProductInventoryResponseDto;
  }

  @Post(':productId/adjust')
  @ApiOperation({ summary: 'Adjust stock quantity' })
  @ApiWrappedResponse({
    status: 201,
    description: 'Stock adjusted successfully.',
    type: ProductInventoryResponseDto,
  })
  async adjustStock(
    @Param('productId') productId: string,
    @Body() adjustStockDto: AdjustStockDto,
  ): Promise<ProductInventoryResponseDto> {
    return (await this.inventoryService.adjustStock(
      productId,
      adjustStockDto,
    )) as unknown as ProductInventoryResponseDto;
  }

  @Get(':productId/history')
  @ApiOperation({ summary: 'Get inventory history for a product' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Inventory history found.',
    type: ProductInventoryHistoryResponseDto,
    isArray: true,
  })
  async getHistory(
    @Param('productId') productId: string,
  ): Promise<ProductInventoryHistoryResponseDto[]> {
    return (await this.inventoryService.getHistory(
      productId,
    )) as unknown as ProductInventoryHistoryResponseDto[];
  }
}
