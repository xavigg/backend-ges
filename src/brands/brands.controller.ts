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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiServiceUnavailableResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SanitizeTextPipe } from 'src/shared/pipes/sanitize.pipe';

// Swagger
@ApiTags('Brands')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
// Controller
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @ApiOperation({ summary: 'Create a new brand' })
  @ApiBadRequestResponse({ description: 'Brand already exists' })
  @ApiCreatedResponse({ description: 'Brand created' })
  @Post()
  async create(@Body() createBrandDto: CreateBrandDto) {
    return await this.brandsService.create(createBrandDto);
  }

  @ApiOperation({ summary: 'Find all brands' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  @ApiOkResponse({ description: 'Show all brands' })
  @Get()
  async findAll() {
    return await this.brandsService.findAll();
  }

  @ApiOperation({ summary: 'Show brand by ID' })
  @ApiNotFoundResponse({ description: 'Brand not found' })
  @ApiOkResponse({ description: 'Show brand by ID' })
  @Get(':brandId')
  async findByID(@Param('brandId', SanitizeTextPipe) brandId: string) {
    return await this.brandsService.findBrandByIdOrName(brandId);
  }

  @ApiOperation({ summary: 'Updated a brand' })
  @ApiBadRequestResponse({description: 'Brand ID was incorrectly formatted or does not exist'})
  @ApiOkResponse({ description: 'Brand Updated' })
  @Patch(':brandId')
  async update(
    @Param('brandId', ParseIntPipe) brandId: number,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return await this.brandsService.update(+brandId, updateBrandDto);
  }

  @ApiOperation({ summary: 'Remove a brand' })
  @ApiBadRequestResponse({description: 'Brand ID was incorrectly formatted'})
  @ApiOkResponse({ description: 'Brand deleted' })
  @Delete(':brandId')
  async remove(@Param('brandId', ParseIntPipe) brandId: number) {
    return await this.brandsService.softDelete(+brandId);
  }
}
