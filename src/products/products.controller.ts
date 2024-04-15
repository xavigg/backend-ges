import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchDto } from './dto/search.dto';
import { ValIdProductPipe } from './pipes/valIdProductPipe.pipe';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

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
  @UsePipes(ValIdProductPipe)
  async update(
    @Param('idproduct', ParseIntPipe) idproduct: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(idproduct, updateProductDto);
  }

  @Delete(':idproduct')
  @UsePipes(ValIdProductPipe)
  async remove(@Param('idproduct', ParseIntPipe) idproduct: number) {
    return this.productsService.remove(idproduct);
  }


}
