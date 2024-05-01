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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchDto } from './dto/search.dto';
import { existProductIdPipe } from './pipes/existProductIdPipe.pipe';
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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

// Swagger
@ApiTags('Products')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
// Contrroller
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiBadRequestResponse({ description: 'Product already exists' })
  @ApiCreatedResponse({ description: 'Product created' })
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Update product' })
  @ApiBadRequestResponse({
    description: 'Product ID was incorrectly formatted or does not exist',
  })
  @ApiOkResponse({ description: 'Product Updated' })
  @Patch(':productId')
  async update(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(+productId, updateProductDto);
  }

  @ApiOperation({ summary: 'Remove products' })
  @ApiBadRequestResponse({
    description: 'Product ID was incorrectly formatted',
  })
  @ApiOkResponse({ description: 'Product deleted' })
  @Delete(':productId')
  @UsePipes(ParseIntPipe, existProductIdPipe)
  async remove(@Param('productId') productId: number) {
    return await this.productsService.softDelete(+productId);
  }

  @ApiOperation({ summary: 'Restore product' })
  @ApiBadRequestResponse({
    description: 'Product ID was incorrectly formatted',
  })
  @ApiOkResponse({ description: 'Product restored' })
  @Post('restore/:productId')
  @UsePipes(ParseIntPipe, existProductIdPipe)
  async restore(@Param('productId') productId: number) {
    return await this.productsService.restoreDeletedProduct(+productId);
  }

  @ApiOperation({ summary: 'Show all products' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  @ApiOkResponse({ description: 'Show all products' })
  @Roles(Role.Admin, Role.User)
  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }

  @ApiOperation({ summary: 'Find product by Id' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiOkResponse({ description: 'Show product by Id' })
  @Roles(Role.User)
  @Get(':productId')
  async findProductByID(
    @Param('productId', ParseIntPipe, existProductIdPipe) productId: number,
  ) {
    return await this.productsService.findProductByID(+productId);
  }

  @ApiOperation({ summary: 'Find products by filters options' })
  @Get('/search')
  @UsePipes(new ValidationPipe())
  async findByOptions(@Query() query: SearchDto) {
    return await this.productsService.findProductByFilterOptions(query);
  }

  @ApiOperation({ summary: 'Find products by Id or Name' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiOkResponse({ description: 'Show product by Id or Name' })
  @Get('search/:idOrName')
  async findByName(@Param('idOrName', SanitizeTextPipe) idOrName: string) {
    return this.productsService.findProductByIdOrName(idOrName);
  }
}
