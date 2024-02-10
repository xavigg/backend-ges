import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':idcategory')
  async findByID(@Param('idbrand') idbrand: number) {
    return this.categoriesService.findByID(idbrand);
  }

  @Patch(':idcategory')
  async update(
    @Param('idcategory') idcategory: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(idcategory, updateCategoryDto);
  }

  @Delete(':idcategory')
  async remove(@Param('idcategory') idcategory: number) {
    return this.categoriesService.remove(idcategory);
  }
}
