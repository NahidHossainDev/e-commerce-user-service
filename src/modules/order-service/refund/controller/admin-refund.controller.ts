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
import {
  AddRefundNoteDto,
  AdminRefundActionDto,
  ProcessRefundDto,
  UpdateRefundStatusDto,
} from '../dto/refund.dto';
import { RefundQueryOptions } from '../dto/refund.query-options.dto';
import { RefundService } from '../refund.service';

@ApiTags('Admin / Refunds')
@Controller('admin/refunds')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminRefundController {
  constructor(private readonly refundService: RefundService) {}

  @Get()
  @ApiOperation({ summary: 'Get all refunds (Admin)' })
  findAll(@Query() query: RefundQueryOptions) {
    return this.refundService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get refund details (Admin)' })
  findById(@Param('id') id: string) {
    return this.refundService.findById(id);
  }

  @Patch(':id/action')
  @ApiOperation({ summary: 'Approve or Reject refund (Admin)' })
  approveOrReject(
    @Param('id') id: string,
    @Body() dto: AdminRefundActionDto,
    @Req() req,
  ) {
    return this.refundService.approveOrReject(id, req.user._id, dto);
  }

  @Post(':id/process')
  @ApiOperation({ summary: 'Process refund payment (Admin)' })
  processPayment(
    @Param('id') id: string,
    @Body() dto: ProcessRefundDto,
    @Req() req,
  ) {
    return this.refundService.processRefundPayment(id, req.user._id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update refund status manually (Admin)' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRefundStatusDto,
    @Req() req,
  ) {
    return this.refundService.updateRefundStatus(id, req.user._id, dto);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add internal note to refund (Admin)' })
  addNote(@Param('id') id: string, @Body() dto: AddRefundNoteDto, @Req() req) {
    return this.refundService.addInternalNote(id, req.user._id, dto);
  }
}
