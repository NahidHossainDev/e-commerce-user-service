import { ApiProperty } from '@nestjs/swagger';
import { MediaStatus, MediaType } from '../domain/media.types';

export class MediaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty({ required: false })
  storageKey?: string;

  @ApiProperty({ enum: MediaStatus, required: false })
  status?: MediaStatus;

  @ApiProperty({ required: false })
  ownerId?: string;

  @ApiProperty({ required: false })
  ownerType?: string;

  @ApiProperty({ enum: MediaType, required: false })
  type?: MediaType;

  @ApiProperty({ required: false })
  format?: string;

  @ApiProperty({ required: false })
  width?: number;

  @ApiProperty({ required: false })
  height?: number;

  @ApiProperty({ required: false })
  size?: number;

  @ApiProperty({ required: false })
  originalName?: string;

  @ApiProperty({ required: false })
  createdAt?: Date;
}
