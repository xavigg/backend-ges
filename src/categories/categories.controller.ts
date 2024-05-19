import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
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
import { SanitizeTextPipe } from 'src/shared/pipes/sanitize.pipe';

// Swagger
@ApiTags('Categories')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
// Controller
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @ApiBadRequestResponse({ description: 'Category already exists' })
  @ApiCreatedResponse({ description: 'Category created' })
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Show all categories' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  @ApiOkResponse({ description: 'Show all categories' })
  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @ApiOperation({ summary: 'Find category by ID or Name' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiOkResponse({ description: 'Show category by ID or Name' })
  @Get(':categoryId')
  async findByID(@Param('categoryId', SanitizeTextPipe) categoryId: string) {
    return await this.categoriesService.findCategoryByIdOrName(categoryId);
  }

  @ApiOperation({ summary: 'Update a category' })
  @ApiBadRequestResponse({
    description: 'User ID was incorrectly formatted or does not exist',
  })
  @ApiOkResponse({ description: 'Category Updated' })
  @Patch(':categoryId')
  async update(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(categoryId, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Remove categories' })
  @ApiBadRequestResponse({
    description: 'Category ID was incorrectly formatted',
  })
  @ApiOkResponse({ description: 'Category deleted' })
  @Delete(':categoryId')
  async remove(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return await this.categoriesService.remove(categoryId);
  }
}
