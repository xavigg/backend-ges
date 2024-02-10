import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  async findAll() {
    return this.brandsService.findAll();
  }

  @Get(':idbrand')
  async findByID(@Param('idbrand') idbrand: number) {
    return this.brandsService.findByID(idbrand);
  }

  @Patch(':idbrand')
  async update(
    @Param('idbrand') idbrand: number,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(idbrand, updateBrandDto);
  }

  @Delete(':idbrand')
  async remove(@Param('idbrand') idbrand: number) {
    return this.brandsService.remove(idbrand);
  }
}
