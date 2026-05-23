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
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import { CreateCmsPageDto, QueryCmsPageDto, UpdateCmsPageDto } from './dto/page.dto';
import { CmsPagesService } from './pages.service';
import { CmsPage } from './schemas/page.schema';

@ApiTags('Admin CMS Pages')
@Controller('admin/cms/pages')
export class AdminCmsPagesController {
  constructor(private readonly pagesService: CmsPagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new CMS page' })
  @ApiWrappedResponse({
    status: HttpStatus.CREATED,
    description: 'Page successfully created.',
    type: CmsPage,
  })
  async create(@Body() dto: CreateCmsPageDto) {
    return await this.pagesService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all pages with search, filters and pagination',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() queryDto: QueryCmsPageDto) {
    return await this.pagesService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve details of a page by ID (including child components)' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.pagesService.getAdminPageDetails(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update page options, status, SEO, and title' })
  @ApiWrappedResponse({
    status: HttpStatus.OK,
    description: 'Page successfully updated.',
    type: CmsPage,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCmsPageDto,
  ) {
    return await this.pagesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a page and cascade-delete its components' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.pagesService.remove(id);
    return { message: 'CMS Page and all associated components successfully deleted' };
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate an entire CMS page alongside all its child components' })
  @ApiWrappedResponse({
    status: HttpStatus.CREATED,
    description: 'Page successfully duplicated.',
    type: CmsPage,
  })
  async duplicate(@Param('id') id: string) {
    return await this.pagesService.duplicatePage(id);
  }
}
