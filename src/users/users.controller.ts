import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { existUserIdPipe } from './pipes/existUserIdPipe.pipe';

// Swagger
@ApiTags('Users')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
// Controller
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBadRequestResponse({ description: 'Email already exists' })
  @ApiCreatedResponse({ description: 'User Created' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Find all users' })
  @ApiOkResponse({ description: 'Show all users' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Find user by Id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOkResponse({ description: 'Show user by id' })
  @Get(':categoryId')
  async findByID(@Param('userId', ParseIntPipe) userId: number) {
    return await this.usersService.findById(userId);
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiBadRequestResponse({
    description: 'User ID was incorrectly formatted or does not exist',
  })
  @ApiOkResponse({ description: 'User Updated' })
  @Patch(':userId')
  async update(
    @Param('userId', ParseIntPipe, existUserIdPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(+userId, updateUserDto);
  }

  @ApiOperation({ summary: 'Remove user' })
  @ApiBadRequestResponse({ description: 'User ID was incorrectly formatted' })
  @ApiOkResponse({ description: 'User deleted' })
  @Delete(':userId')
  async remove(@Param('userId', existUserIdPipe, ParseIntPipe) userId: number) {
    return await this.usersService.remove(+userId);
  }
}
