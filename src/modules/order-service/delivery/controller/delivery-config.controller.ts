import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeliveryConfigService } from '../delivery-config.service';
import { CalculateDeliveryFeeDto } from '../dto/delivery-config.dto';

@ApiTags('Delivery Configuration')
@Controller('delivery-config')
export class DeliveryConfigController {
  constructor(private readonly deliveryConfigService: DeliveryConfigService) {}

  @Get('public')
  @ApiOperation({ summary: 'Get active delivery configuration and zones for storefront' })
  async getPublicConfig() {
    const config = await this.deliveryConfigService.getOrCreateConfig();
    return {
      defaultFee: config.defaultFee,
      enableGlobalFreeDelivery: config.enableGlobalFreeDelivery,
      globalFreeDeliveryMinOrder: config.globalFreeDeliveryMinOrder,
      zones: (config.zones || [])
        .filter((z) => z.isActive)
        .map((z) => ({
          _id: z._id,
          name: z.name,
          code: z.code,
          deliveryFee: z.deliveryFee,
          isDefault: z.isDefault,
          matchedCities: z.matchedCities,
          freeDeliveryPolicy: z.freeDeliveryPolicy,
          minOrderForFreeDelivery: z.minOrderForFreeDelivery,
          estimatedDays: z.estimatedDays,
        })),
    };
  }

  @Post('calculate')
  @ApiOperation({ summary: 'Preview delivery fee calculation for given cart subtotal and city' })
  async calculateFee(@Body() dto: CalculateDeliveryFeeDto) {
    return this.deliveryConfigService.calculateDeliveryFee(
      dto.subTotal,
      dto.city,
      dto.couponCode ? { discountType: dto.couponCode } : undefined,
    );
  }
}
