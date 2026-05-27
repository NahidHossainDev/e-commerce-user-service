import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import { CmsComponentsService } from './components.service';
import { COMPONENT_REGISTRY } from './constants/component.constants';
import {
  CreateCmsComponentDto,
  ReorderComponentsDto,
  UpdateCmsComponentDto,
} from './dto/component.dto';
import { CmsComponent } from './schemas/component.schema';

@ApiTags('Admin CMS Components')
@Controller()
export class AdminCmsComponentsController {
  constructor(private readonly componentsService: CmsComponentsService) {}

  @Get('admin/cms/component-types')
  @ApiOperation({
    summary: 'Retrieve metadata definitions and configurable fields for all component types',
  })
  @HttpCode(HttpStatus.OK)
  getComponentTypes() {
    return COMPONENT_REGISTRY;
  }

  @Post('admin/cms/pages/:pageId/components')
  @ApiOperation({ summary: 'Add a new CMS component to a specific page' })
  @ApiWrappedResponse({
    status: HttpStatus.CREATED,
    description: 'Component successfully added.',
    type: CmsComponent,
  })
  async create(
    @Param('pageId') pageId: string,
    @Body() dto: CreateCmsComponentDto,
  ) {
    return await this.componentsService.create(pageId, dto);
  }

  @Patch('admin/cms/components/:id')
  @ApiOperation({ summary: 'Update settings or properties of a specific component' })
  @ApiWrappedResponse({
    status: HttpStatus.OK,
    description: 'Component successfully updated.',
    type: CmsComponent,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCmsComponentDto,
  ) {
    return await this.componentsService.update(id, dto);
  }

  @Delete('admin/cms/components/:id')
  @ApiOperation({ summary: 'Remove a specific CMS component' })
  @ApiWrappedResponse({
    status: HttpStatus.OK,
    description: 'Component successfully deleted.',
    type: CmsComponent,
  })
  async remove(@Param('id') id: string) {
    return await this.componentsService.remove(id);
  }

  @Post('admin/cms/components/:id/duplicate')
  @ApiOperation({ summary: 'Duplicate an existing CMS component' })
  @ApiWrappedResponse({
    status: HttpStatus.CREATED,
    description: 'Component successfully duplicated.',
    type: CmsComponent,
  })
  async duplicate(@Param('id') id: string) {
    return await this.componentsService.duplicateComponent(id);
  }

  @Patch('admin/cms/components/reorder')
  @ApiOperation({ summary: 'Reorder multiple components in a batch' })
  @HttpCode(HttpStatus.OK)
  async reorder(@Body() dto: ReorderComponentsDto) {
    await this.componentsService.reorder(dto);
    return { message: 'Components successfully reordered' };
  }
}
