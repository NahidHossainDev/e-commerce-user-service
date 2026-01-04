import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '../domain/media.types';

export class MediaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty({ enum: MediaType })
  type: MediaType;

  @ApiProperty()
  format: string;

  @ApiProperty({ required: false })
  width?: number;

  @ApiProperty({ required: false })
  height?: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  originalName: string;

  @ApiProperty()
  createdAt: Date;
}
