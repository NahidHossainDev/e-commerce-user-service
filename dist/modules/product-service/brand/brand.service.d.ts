import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { BrandQueryOptionsDto } from './dto/brand-query-options.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandDocument } from './schemas/brand.schema';
export declare class BrandService {
    private readonly brandModel;
    private readonly eventEmitter;
    constructor(brandModel: Model<BrandDocument>, eventEmitter: EventEmitter2);
    create(createBrandDto: CreateBrandDto): Promise<BrandDocument>;
    findAll(query: BrandQueryOptionsDto): Promise<import("../../../common/interface").IPaginatedResponse<BrandDocument>>;
    findOne(id: string): Promise<BrandDocument>;
    update(id: string, updateBrandDto: UpdateBrandDto): Promise<BrandDocument>;
    remove(id: string): Promise<BrandDocument>;
}
