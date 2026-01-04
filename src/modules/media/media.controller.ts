import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MediaResponseDto } from './dto/media-response.dto';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ type: MediaResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 50 }), // 50MB
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|mp4|pdf|doc|docx|xls|xlsx|csv)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<MediaResponseDto> {
    return this.mediaService.uploadFile(file);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file metadata' })
  @ApiResponse({ type: MediaResponseDto })
  async getFileMetadata(@Param('id') id: string): Promise<MediaResponseDto> {
    return this.mediaService.getFileMetadata(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a file' })
  async deleteFile(@Param('id') id: string): Promise<void> {
    return this.mediaService.deleteFile(id);
  }
}
