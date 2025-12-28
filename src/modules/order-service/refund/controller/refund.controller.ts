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
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import {
  CancelRefundRequestDto,
  CreateRefundRequestDto,
} from '../dto/refund.dto';
import { RefundQueryOptions } from '../dto/refund.query-options.dto';
import { RefundService } from '../refund.service';

@ApiTags('Private / Refunds')
@Controller('refunds')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new refund request (Customer)' })
  create(@Body() dto: CreateRefundRequestDto, @Req() req) {
    return this.refundService.createRefundRequest(req.user._id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all refunds for current user' })
  findAllByUser(@Query() query: RefundQueryOptions, @Req() req) {
    return this.refundService.findAllByUser(req.user._id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get refund details' })
  findById(@Param('id') id: string, @Req() req) {
    return this.refundService.findById(id, req.user._id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a refund request' })
  cancel(
    @Param('id') id: string,
    @Body() dto: CancelRefundRequestDto,
    @Req() req,
  ) {
    return this.refundService.cancelRefund(id, req.user._id, dto);
  }
}
