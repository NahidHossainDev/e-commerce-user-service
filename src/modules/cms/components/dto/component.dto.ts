import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CmsComponentType } from '../enums/component.enum';

export class ComponentSettingsDto {
  @ApiPropertyOptional({ description: 'Layout container type', default: 'boxed' })
  @IsOptional()
  @IsString()
  container?: string = 'boxed';

  @ApiPropertyOptional({ description: 'Force edge-to-edge content display', default: false })
  @IsOptional()
  @IsBoolean()
  fullWidth?: boolean = false;

  @ApiPropertyOptional({ description: 'CSS background-color override' })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional({ description: 'CSS padding-top value (e.g. 20px, 2rem)' })
  @IsOptional()
  @IsString()
  paddingTop?: string;

  @ApiPropertyOptional({ description: 'CSS padding-bottom value (e.g. 20px, 2rem)' })
  @IsOptional()
  @IsString()
  paddingBottom?: string;
}

export class CreateCmsComponentDto {
  @ApiProperty({ enum: CmsComponentType, description: 'Component renderer type' })
  @IsEnum(CmsComponentType)
  componentType!: CmsComponentType;

  @ApiProperty({ description: 'Display order index number', minimum: 0 })
  @IsNumber()
  @Min(0)
  order!: number;

  @ApiPropertyOptional({ description: 'Visibility status flag', default: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean = true;

  @ApiPropertyOptional({ type: ComponentSettingsDto, description: 'Component container settings' })
  @IsOptional()
  @ValidateNested()
  @Type(() => ComponentSettingsDto)
  settings?: ComponentSettingsDto;

  @ApiProperty({ type: Object, description: 'Dynamic component properties mapping' })
  @IsObject()
  @IsNotEmptyObject()
  data!: Record<string, any>;
}

export class UpdateCmsComponentDto extends PartialType(CreateCmsComponentDto) {}

export class ReorderItemDto {
  @ApiProperty({ description: 'Database ID of the CmsComponent' })
  @IsString()
  id!: string;

  @ApiProperty({ description: 'New sequential order index mapping' })
  @IsNumber()
  @Min(0)
  order!: number;
}

export class ReorderComponentsDto {
  @ApiProperty({ type: [ReorderItemDto], description: 'Ordered list of components' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  components!: ReorderItemDto[];
}
