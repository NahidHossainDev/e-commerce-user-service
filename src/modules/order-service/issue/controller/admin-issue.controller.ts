import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/modules/user-service/user/user.schema';
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import {
  AddIssueNoteDto,
  IssueQueryOptionsDto,
  PaginatedIssueResponseDto,
  ResolveIssueDto,
  UpdateIssueStatusDto,
} from '../dto/issue.dto';
import { IssueService } from '../issue.service';
import { Issue } from '../schemas/issue.schema';

@ApiTags('Admin / Issues')
@Controller('admin/issues')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminIssueController {
  constructor(private readonly issueService: IssueService) {}

  @Get()
  @ApiOperation({ summary: 'Get all order issues with search, filter, and sorting (Admin)' })
  @ApiWrappedResponse({
    status: 200,
    description: 'List of order issues with pagination',
    type: PaginatedIssueResponseDto,
  })
  findAll(@Query() query: IssueQueryOptionsDto) {
    return this.issueService.findAllAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order issue details (Admin)' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Order issue details',
    type: Issue,
  })
  findById(@Param('id') id: string) {
    return this.issueService.findById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update issue status (Admin)' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Issue status updated',
    type: Issue,
  })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateIssueStatusDto,
    @Req() req,
  ) {
    return this.issueService.updateStatus(id, req.user._id, dto);
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Resolve an order issue (Admin)' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Issue resolved',
    type: Issue,
  })
  resolve(
    @Param('id') id: string,
    @Body() dto: ResolveIssueDto,
    @Req() req,
  ) {
    return this.issueService.resolveIssue(id, req.user._id, dto);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add internal note to issue (Admin)' })
  @ApiWrappedResponse({
    status: 201,
    description: 'Note added to issue',
    type: Issue,
  })
  addNote(
    @Param('id') id: string,
    @Body() dto: AddIssueNoteDto,
    @Req() req,
  ) {
    return this.issueService.addNote(id, req.user._id, dto);
  }
}
