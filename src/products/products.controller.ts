import { Controller, Req, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Request } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async find(@Req() request: Request): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':idproduct')
  async findOne(@Param('idproduct') idproduct: number): Promise<Product> {
    return this.productsService.findOne(idproduct);
  }


  @Patch(':idproduct')
  async update(@Param('idproduct') idproduct: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(idproduct, updateProductDto);
  }

  @Delete(':idproduct')
  async remove(@Param('idproduct') idproduct: number) {
    return this.productsService.remove(idproduct);
  }
}
