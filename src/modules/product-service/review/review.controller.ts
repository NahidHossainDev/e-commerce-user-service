import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Roles } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IAuthUser, UserRole } from 'src/common/interface';
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewQueryOptionsDto } from './dto/review-query-options.dto';
import {
  PaginatedReviewsResponseDto,
  RatingSummaryResponseDto,
  ReviewResponseDto,
} from './dto/review-response.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './review.service';
import { VoteType } from './schemas/review.schema';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiWrappedResponse({
    status: 201,
    description: 'Review created successfully.',
    type: ReviewResponseDto,
  })
  async create(
    @CurrentUser() user: IAuthUser,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    return (await this.reviewService.create(
      user.id,
      createReviewDto,
    )) as unknown as ReviewResponseDto;
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all reviews with pagination and filters' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Paginated list of reviews.',
    type: PaginatedReviewsResponseDto,
  })
  async findAll(
    @Query() query: ReviewQueryOptionsDto,
  ): Promise<PaginatedReviewsResponseDto> {
    return (await this.reviewService.findAll(
      query,
    )) as unknown as PaginatedReviewsResponseDto;
  }

  @Get('summary/:productId')
  @ApiOperation({ summary: 'Get rating summary for a product' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Rating summary retrieved successfully.',
    type: RatingSummaryResponseDto,
  })
  async getSummary(
    @Param('productId') productId: string,
  ): Promise<RatingSummaryResponseDto> {
    return (await this.reviewService.getRatingSummary(
      productId,
    )) as unknown as RatingSummaryResponseDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single review by ID' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Review found.',
    type: ReviewResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<ReviewResponseDto> {
    return (await this.reviewService.findOne(
      id,
    )) as unknown as ReviewResponseDto;
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a review (Admin only)' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Review updated successfully.',
    type: ReviewResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() admin: IAuthUser,
  ): Promise<ReviewResponseDto> {
    return (await this.reviewService.update(
      id,
      updateReviewDto,
      admin.id,
    )) as unknown as ReviewResponseDto;
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a review (Admin only)' })
  @ApiWrappedResponse({
    status: 200,
    description: 'Review deleted successfully.',
    type: ReviewResponseDto,
  })
  async remove(@Param('id') id: string): Promise<ReviewResponseDto> {
    return (await this.reviewService.remove(
      id,
    )) as unknown as ReviewResponseDto;
  }

  @Post(':id/vote')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Vote on a review' })
  @ApiWrappedResponse({
    status: 201,
    description: 'Vote recorded successfully.',
    type: ReviewResponseDto,
  })
  async vote(
    @Param('id') id: string,
    @CurrentUser() user: IAuthUser,
    @Body('voteType') voteType: VoteType,
  ): Promise<ReviewResponseDto> {
    return (await this.reviewService.vote(
      id,
      user.id,
      voteType,
    )) as unknown as ReviewResponseDto;
  }
}
