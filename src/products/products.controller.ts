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
} from '@nestjs/common';
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
  async findById(@Param('idproduct', ParseIntPipe) idproduct: number): Promise<Product> {
    return this.productsService.findById(idproduct);
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

  // BRANDS
  @Get('/brand/id/:brandID')
  async findByBrandId(@Param('brandID', ParseIntPipe) brandID: number) {
    return this.productsService.findByBrandId(brandID);
  }

  @Get('/brand/:brandName')
  async findByBrandName(@Param('brandName') brandName: string) {
    return this.productsService.findByBrandName(brandName);
  }
    
  // CATEGORIES
  @Get('/category/id/:categoryId')
  async findByCategoryId(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productsService.findByCategoryId(categoryId);
  }

  @Get('/category/:categoryName')
  async findByCategoryName(@Param('categoryName') categoryName: string) {
    return this.productsService.findByCategoryName(categoryName);
  }

}
