import { Model } from 'mongoose';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UnitQueryOptions } from './dto/unit-query-options.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit, UnitDocument } from './schemas/unit.schema';
export declare class UnitService {
    private unitModel;
    constructor(unitModel: Model<UnitDocument>);
    create(createUnitDto: CreateUnitDto): Promise<Unit>;
    findAll(query: UnitQueryOptions): Promise<import("../../../common/interface").IPaginatedResponse<import("mongoose").Document<unknown, {}, Unit, {}, {}> & Unit & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>>;
    findOne(id: string): Promise<Unit>;
    update(id: string, updateUnitDto: UpdateUnitDto): Promise<Unit>;
    remove(id: string): Promise<Unit>;
}
