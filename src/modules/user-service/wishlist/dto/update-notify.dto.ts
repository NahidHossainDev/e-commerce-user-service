import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateNotifyDto {
  @ApiProperty({ description: "Whether user wants stock notification", example: true })
  @IsBoolean()
  @IsNotEmpty()
  notify: boolean;
}
