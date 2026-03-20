import { CreateUnitDto } from './dto/create-unit.dto';
import { UnitQueryOptions } from './dto/unit-query-options.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitService } from './unit.service';
export declare class UnitController {
    private readonly unitService;
    constructor(unitService: UnitService);
    create(createUnitDto: CreateUnitDto): Promise<import("./schemas/unit.schema").Unit>;
    findAll(query: UnitQueryOptions): Promise<import("../../../common/interface").IPaginatedResponse<import("mongoose").Document<unknown, {}, import("./schemas/unit.schema").Unit, {}, {}> & import("./schemas/unit.schema").Unit & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>>;
    findOne(id: string): Promise<import("./schemas/unit.schema").Unit>;
    update(id: string, updateUnitDto: UpdateUnitDto): Promise<import("./schemas/unit.schema").Unit>;
    remove(id: string): Promise<import("./schemas/unit.schema").Unit>;
}
