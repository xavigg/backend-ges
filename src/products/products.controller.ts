import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchDto } from './dto/search.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('search')
  @UsePipes(new ValidationPipe())
  async findByOptions(@Query() query: SearchDto) {
    return this.productsService.findByOptions(query);
  }

  @Patch(':idproduct')
  async update(
    @Param('idproduct', ParseIntPipe) idproduct: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(idproduct, updateProductDto);
  }

  @Delete(':idproduct')
  async remove(@Param('idproduct', ParseIntPipe) idproduct: number) {
    return this.productsService.remove(idproduct);
  }


}
