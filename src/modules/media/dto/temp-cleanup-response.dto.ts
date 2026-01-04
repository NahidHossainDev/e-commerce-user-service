import { ApiProperty } from '@nestjs/swagger';

export class TempCleanupResponseDto {
  @ApiProperty()
  deletedCount: number;

  @ApiProperty({ type: [String] })
  deletedIds: string[];

  @ApiProperty()
  message: string;
}
