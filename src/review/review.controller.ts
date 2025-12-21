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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserDocument, UserRole } from 'src/user/user.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewQueryOptionsDto } from './dto/review-query-options.dto';
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
  async create(
    @CurrentUser() user: UserDocument,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return await this.reviewService.create(user._id.toString(), createReviewDto);
  }

  @Get()
  async findAll(@Query() query: ReviewQueryOptionsDto) {
    return await this.reviewService.findAll(query);
  }

  @Get('summary/:productId')
  async getSummary(@Param('productId') productId: string) {
    return await this.reviewService.getRatingSummary(productId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reviewService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() admin: UserDocument,
  ) {
    return await this.reviewService.update(id, updateReviewDto, admin._id.toString());
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return await this.reviewService.remove(id);
  }

  @Post(':id/vote')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async vote(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
    @Body('voteType') voteType: VoteType,
  ) {
    return await this.reviewService.vote(id, user._id.toString(), voteType);
  }
}
