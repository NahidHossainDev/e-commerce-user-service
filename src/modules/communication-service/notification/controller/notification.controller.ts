import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserDocument } from 'src/modules/user-service/user/user.schema';
import { NotificationQueryDto } from '../dto';
import { NotificationService } from '../notification.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user notifications (paginated)' })
  findAll(
    @CurrentUser() user: UserDocument,
    @Query() query: NotificationQueryDto,
  ) {
    return this.notificationService.findAllForUser(user._id.toString(), query);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get current user unread notifications count' })
  getUnreadCount(@CurrentUser() user: UserDocument) {
    return this.notificationService.getUnreadCount(user._id.toString());
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  markAsRead(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.notificationService.markAsRead(user._id.toString(), id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read for current user' })
  markAllAsRead(@CurrentUser() user: UserDocument) {
    return this.notificationService.markAllAsRead(user._id.toString());
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification for current user' })
  deleteForUser(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.notificationService.deleteForUser(user._id.toString(), id);
  }
}
