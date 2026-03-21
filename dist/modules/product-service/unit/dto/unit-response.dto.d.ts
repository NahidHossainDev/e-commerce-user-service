import { UnitCategory } from '../schemas/unit.schema';
export declare class UnitResponseDto {
    _id: any;
    name: string;
    symbol: string;
    category: UnitCategory;
    allowsDecimal: boolean;
}
export declare class PaginationMetaDto {
    totalCount: number;
    totalPages: number;
    limit: number;
    page: number;
    nextPage: number | null;
}
export declare class PaginatedUnitsResponseDto {
    data: UnitResponseDto[];
    meta: PaginationMetaDto;
}
