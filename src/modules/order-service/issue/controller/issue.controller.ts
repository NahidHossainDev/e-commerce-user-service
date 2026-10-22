import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import {
  CreateIssueDto,
  IssueQueryOptionsDto,
  PaginatedIssueResponseDto,
} from '../dto/issue.dto';
import { IssueService } from '../issue.service';
import { Issue } from '../schemas/issue.schema';

@ApiTags('Private / Issues')
@Controller('issues')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Post()
  @ApiOperation({ summary: 'Report a new issue for an order (Customer)' })
  @ApiWrappedResponse({
    status: 201,
    description: 'Issue reported successfully',
    type: Issue,
  })
  create(@Body() dto: CreateIssueDto, @Req() req) {
    return this.issueService.createIssue(req.user._id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reported issues for current user' })
  @ApiWrappedResponse({
    status: 200,
    description: 'List of user issues with pagination',
    type: PaginatedIssueResponseDto,
  })
  findAllByUser(@Query() query: IssueQueryOptionsDto, @Req() req) {
    return this.issueService.findAllByUser(req.user._id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get issue details by ID (Customer)' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Issue details',
    type: Issue,
  })
  findById(@Param('id') id: string, @Req() req) {
    return this.issueService.findById(id, req.user._id);
  }
}
