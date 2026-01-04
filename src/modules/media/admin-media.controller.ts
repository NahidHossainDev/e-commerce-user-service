import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/modules/user-service/user/user.schema';
import { TempCleanupResponseDto } from './dto/temp-cleanup-response.dto';
import { MediaService } from './media.service';

@ApiTags('Admin / Media')
@Controller('admin/media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminMediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('cleanup-temp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clean up expired temporary media files (Admin)' })
  @ApiResponse({ type: TempCleanupResponseDto })
  async cleanupTempFiles(): Promise<TempCleanupResponseDto> {
    const result = await this.mediaService.cleanupTempFiles();
    return {
      ...result,
      message:
        result.deletedCount > 0
          ? `Successfully cleaned up ${result.deletedCount} temporary media files.`
          : 'No expired temporary media files found.',
    };
  }
}
