import { ApiProperty } from '@nestjs/swagger';

export class CleanupResponseDto {
  @ApiProperty()
  deletedCount: number;

  @ApiProperty({ type: [String] })
  deletedKeys: string[];

  @ApiProperty()
  message: string;
}
