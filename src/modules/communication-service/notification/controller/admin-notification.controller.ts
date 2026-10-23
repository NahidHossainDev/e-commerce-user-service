import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/interface';
import { UserDocument } from 'src/modules/user-service/user/user.schema';
import { AdminNotificationQueryDto, AdminSendNotificationDto } from '../dto';
import { NotificationService } from '../notification.service';

@ApiTags('Admin Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/notifications')
export class AdminNotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @ApiOperation({
    summary:
      'Send marketing or broadcast notification to users (all, specific, or user group)',
  })
  sendNotification(
    @CurrentUser() user: UserDocument,
    @Body() dto: AdminSendNotificationDto,
  ) {
    return this.notificationService.adminSendNotification(
      dto,
      user._id.toString(),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications with filtering (Admin)' })
  findAll(@Query() query: AdminNotificationQueryDto) {
    return this.notificationService.adminFindAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get notification overview statistics (Admin)' })
  getStats() {
    return this.notificationService.adminGetStats();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification (Admin)' })
  delete(@Param('id') id: string) {
    return this.notificationService.adminDelete(id);
  }
}
