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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UnitQueryOptions } from './dto/unit-query-options.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitService } from './unit.service';

@ApiTags('Units')
@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new measurement unit' })
  @ApiResponse({
    status: 201,
    description: 'The unit has been successfully created.',
  })
  @ApiResponse({
    status: 409,
    description: 'Unit name or symbol already exists.',
  })
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all measurement units' })
  findAll(@Query() query: UnitQueryOptions) {
    return this.unitService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a unit by ID' })
  @ApiResponse({ status: 404, description: 'Unit not found.' })
  findOne(@Param('id') id: string) {
    return this.unitService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a unit by ID' })
  @ApiResponse({ status: 404, description: 'Unit not found.' })
  @ApiResponse({
    status: 409,
    description: 'Unit name or symbol already exists.',
  })
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitService.update(id, updateUnitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a unit by ID' })
  @ApiResponse({ status: 404, description: 'Unit not found.' })
  remove(@Param('id') id: string) {
    return this.unitService.remove(id);
  }
}
