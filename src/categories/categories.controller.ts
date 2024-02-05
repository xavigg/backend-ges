import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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

  @Get(':idbrand')
  async findOne(@Param('idbrand') idbrand: number) {
    return this.categoriesService.findOne(idbrand);
  }

  @Patch(':idbrand')
  async update(@Param('idbrand') idbrand: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(idbrand, updateCategoryDto);
  }

  @Delete(':idbrand')
  async remove(@Param('idbrand') idbrand: number) {
    return this.categoriesService.remove(idbrand);
  }
}
