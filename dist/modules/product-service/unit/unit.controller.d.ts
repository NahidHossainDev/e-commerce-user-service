import { CreateUnitDto } from './dto/create-unit.dto';
import { PaginatedUnitsResponseDto, UnitResponseDto } from './dto/unit-response.dto';
import { UnitQueryOptions } from './dto/unit-query-options.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitService } from './unit.service';
export declare class UnitController {
    private readonly unitService;
    constructor(unitService: UnitService);
    create(createUnitDto: CreateUnitDto): Promise<UnitResponseDto>;
    findAll(query: UnitQueryOptions): Promise<PaginatedUnitsResponseDto>;
    findOne(id: string): Promise<UnitResponseDto>;
    update(id: string, updateUnitDto: UpdateUnitDto): Promise<UnitResponseDto>;
    remove(id: string): Promise<UnitResponseDto>;
}
