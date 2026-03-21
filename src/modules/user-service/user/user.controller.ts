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
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiWrappedResponse } from 'src/utils/response/swagger.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryOptions } from './dto/user-query-options.dto';
import {
  PaginatedUsersResponseDto,
  UserResponseDto,
} from './dto/user-response.dto';
import { UserRole } from './user.schema';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new user (admin only)' })
  @ApiWrappedResponse({
    status: 201,
    description: 'User created successfully.',
    type: UserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return (await this.userService.create(
      createUserDto,
    )) as unknown as UserResponseDto;
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: 'List all users with pagination and filters (admin only)',
  })
  @ApiWrappedResponse({
    status: 200,
    description: 'Paginated list of users.',
    type: PaginatedUsersResponseDto,
  })
  async findAll(
    @Query() query: UserQueryOptions,
  ): Promise<PaginatedUsersResponseDto> {
    return (await this.userService.findAll(
      query,
    )) as unknown as PaginatedUsersResponseDto;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiWrappedResponse({
    status: 200,
    description: 'User found.',
    type: UserResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return (await this.userService.findOne(id)) as unknown as UserResponseDto;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiWrappedResponse({
    status: 200,
    description: 'User updated successfully.',
    type: UserResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return (await this.userService.update(
      id,
      updateUserDto,
    )) as unknown as UserResponseDto;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a user by ID (admin only)' })
  @ApiWrappedResponse({
    status: 200,
    description: 'User deleted - returns the deleted document.',
    type: UserResponseDto,
  })
  async remove(@Param('id') id: string): Promise<UserResponseDto> {
    return (await this.userService.remove(id)) as unknown as UserResponseDto;
  }
}
