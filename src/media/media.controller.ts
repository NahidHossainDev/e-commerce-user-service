import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMediaDto, UpdateMediaDto } from './dto/media.dto';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiOperation({ summary: 'Create media for a product' })
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get media by product ID' })
  findByProductId(@Param('productId') productId: string) {
    return this.mediaService.findByProductId(productId);
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Update media by product ID' })
  update(@Param('productId') productId: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(productId, updateMediaDto);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Delete media by product ID' })
  remove(@Param('productId') productId: string) {
    return this.mediaService.remove(productId);
  }
}
