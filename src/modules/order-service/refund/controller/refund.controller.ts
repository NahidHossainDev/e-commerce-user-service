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
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import {
  CancelRefundRequestDto,
  CreateRefundRequestDto,
  PaginatedRefundResponseDto,
} from '../dto/refund.dto';
import { RefundQueryOptions } from '../dto/refund.query-options.dto';
import { RefundService } from '../refund.service';
import { Refund } from '../schemas/refund.schema';

@ApiTags('Private / Refunds')
@Controller('refunds')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new refund request (Customer)' })
  @ApiWrappedResponse({
    status: 201,
    description: 'Refund request created successfully',
    type: Refund,
  })
  create(@Body() dto: CreateRefundRequestDto, @Req() req) {
    return this.refundService.createRefundRequest(req.user._id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all refunds for current user' })
  @ApiWrappedResponse({
    status: 200,
    description: 'List of user refunds with pagination',
    type: PaginatedRefundResponseDto,
  })
  findAllByUser(@Query() query: RefundQueryOptions, @Req() req) {
    return this.refundService.findAllByUser(req.user._id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get refund details' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Refund details',
    type: Refund,
  })
  findById(@Param('id') id: string, @Req() req) {
    return this.refundService.findById(id, req.user._id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a refund request' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Refund request cancelled successfully',
    type: Refund,
  })
  cancel(
    @Param('id') id: string,
    @Body() dto: CancelRefundRequestDto,
    @Req() req,
  ) {
    return this.refundService.cancelRefund(id, req.user._id, dto);
  }
}
