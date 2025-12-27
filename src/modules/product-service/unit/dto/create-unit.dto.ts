import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UnitCategory } from '../schemas/unit.schema';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsEnum(UnitCategory)
  @IsNotEmpty()
  category: UnitCategory;

  @IsBoolean()
  @IsNotEmpty()
  allowsDecimal: boolean;
}
