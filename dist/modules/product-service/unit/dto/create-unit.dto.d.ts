import { UnitCategory } from '../schemas/unit.schema';
export declare class CreateUnitDto {
    name: string;
    symbol: string;
    category: UnitCategory;
    allowsDecimal: boolean;
}
