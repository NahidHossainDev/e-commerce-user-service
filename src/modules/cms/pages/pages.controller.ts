import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CmsPagesService } from './pages.service';

@ApiTags('CMS Public Storefront')
@Controller('cms')
export class CmsPagesController {
  constructor(private readonly pagesService: CmsPagesService) {}

  @Get()
  @ApiOperation({
    summary: 'Fetch fully assembled homepage schema for storefront rendering',
  })
  async getHomePage(@Query('previewToken') previewToken?: string) {
    return await this.pagesService.getPageForStorefront(undefined, previewToken);
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Fetch fully assembled page and component schemas by slug for storefront rendering',
  })
  async getPage(
    @Param('slug') slug: string,
    @Query('previewToken') previewToken?: string,
  ) {
    return await this.pagesService.getPageForStorefront(slug, previewToken);
  }
}
