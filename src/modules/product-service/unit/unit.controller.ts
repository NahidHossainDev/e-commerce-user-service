import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import { CreateUnitDto } from './dto/create-unit.dto';
import {
  PaginatedUnitsResponseDto,
  UnitResponseDto,
} from './dto/unit-response.dto';
import { UnitQueryOptions } from './dto/unit-query-options.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitService } from './unit.service';

@ApiTags('Units')
@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new measurement unit' })
  @ApiWrappedResponse({
    status: 201,
    description: 'The unit has been successfully created.',
    type: UnitResponseDto,
  })
  async create(@Body() createUnitDto: CreateUnitDto): Promise<UnitResponseDto> {
    return (await this.unitService.create(
      createUnitDto,
    )) as unknown as UnitResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all measurement units' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Paginated list of units.',
    type: PaginatedUnitsResponseDto,
  })
  async findAll(
    @Query() query: UnitQueryOptions,
  ): Promise<PaginatedUnitsResponseDto> {
    return (await this.unitService.findAll(
      query,
    )) as unknown as PaginatedUnitsResponseDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a unit by ID' })
  @ApiWrappedResponse({
    status: 200,
    description: 'The unit has been successfully retrieved.',
    type: UnitResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<UnitResponseDto> {
    return (await this.unitService.findOne(id)) as unknown as UnitResponseDto;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a unit by ID' })
  @ApiWrappedResponse({
    status: 200,
    description: 'The unit has been successfully updated.',
    type: UnitResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ): Promise<UnitResponseDto> {
    return (await this.unitService.update(
      id,
      updateUnitDto,
    )) as unknown as UnitResponseDto;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a unit by ID' })
  @ApiWrappedResponse({
    status: 200,
    description: 'The unit has been successfully deleted.',
    type: UnitResponseDto,
  })
  async remove(@Param('id') id: string): Promise<UnitResponseDto> {
    return (await this.unitService.remove(id)) as unknown as UnitResponseDto;
  }
}
