import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/modules/user-service/user/user.schema';
import { DeliveryConfigService } from '../delivery-config.service';
import {
  CreateDeliveryZoneDto,
  UpdateDeliveryZoneDto,
  UpdateGlobalDeliveryConfigDto,
} from '../dto/delivery-config.dto';

@ApiTags('Admin / Delivery Configuration')
@Controller('admin/delivery-config')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminDeliveryConfigController {
  constructor(private readonly deliveryConfigService: DeliveryConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Get current delivery configuration (Admin)' })
  getConfig() {
    return this.deliveryConfigService.getOrCreateConfig();
  }

  @Put('global')
  @ApiOperation({ summary: 'Update global delivery settings (Admin)' })
  updateGlobal(@Body() dto: UpdateGlobalDeliveryConfigDto) {
    return this.deliveryConfigService.updateGlobalConfig(dto);
  }

  @Post('zones')
  @ApiOperation({ summary: 'Add a new delivery zone (Admin)' })
  addZone(@Body() dto: CreateDeliveryZoneDto) {
    return this.deliveryConfigService.addZone(dto);
  }

  @Put('zones/:zoneId')
  @ApiOperation({ summary: 'Update a delivery zone (Admin)' })
  updateZone(
    @Param('zoneId') zoneId: string,
    @Body() dto: UpdateDeliveryZoneDto,
  ) {
    return this.deliveryConfigService.updateZone(zoneId, dto);
  }

  @Delete('zones/:zoneId')
  @ApiOperation({ summary: 'Delete a delivery zone (Admin)' })
  deleteZone(@Param('zoneId') zoneId: string) {
    return this.deliveryConfigService.deleteZone(zoneId);
  }
}
