import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
} from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ErrorHandler } from 'src/utils/error.handler';
import { ProductQuery } from './interface/products.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      return await this.productsRepository.save(createProductDto);
    } catch (error) {
      ErrorHandler.handleServiceUnavailableError('Could not connect to the DB');
    }
  }

  async update(
    idproduct: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const product = await this.productsRepository.findOneOrFail({
        where: { idproduct },
      });
      Object.assign(product, updateProductDto);
      return await this.productsRepository.save(product);
    } catch (error) {
      ErrorHandler.handleBadRequestError(
        'Product ID was incorrectly formatted or does not exist',
      );
    }
  }

  async remove(idproduct: number): Promise<void> {
    try {
      const result = await this.productsRepository.delete(idproduct);
      if (result.affected === 0) {
        throw new ErrorHandler({
          type: 'NOT_FOUND',
          message: `Product with ID ${idproduct} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
    } catch (error) {
      ErrorHandler.handleBadRequestError(
        'Product ID was incorrectly formatted or does not exist',
      );
    }
  }
  
  async findAll(): Promise<Product[]> {
    try {
      let products = await this.productsRepository.find({ relations: [ "category", "brand" ] });
      if (!products.length) {
        ErrorHandler.handleNotFoundError('Error - No products found');
      }
      return products;
    } catch (error) {
      ErrorHandler.handleServiceUnavailableError(error);
    }
  }

  async findByOptions(query: ProductQuery): Promise<Product[]> {
    const queryOptions = this.buildQueryOptions(query);
    try {
      const products = await this.productsRepository.find(queryOptions);
      if (products.length === 0) {
        throw new ErrorHandler({
          type: 'NOT_FOUND',
          message: 'No products found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return products;
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }

  private buildQueryOptions(query: ProductQuery): FindManyOptions<Product> {
    const { brand, category, minPrice, maxPrice, orderBy } = query;
    let whereConditions = {};
    let orderConditions = {};

    if (brand) whereConditions = { ...whereConditions, brand: { name: brand } };
    if (category)
      whereConditions = { ...whereConditions, category: { name: category } };
    if (minPrice !== undefined && maxPrice !== undefined)
      whereConditions['price'] = Between(minPrice, maxPrice);
    else if (minPrice !== undefined)
      whereConditions['price'] = MoreThanOrEqual(minPrice);
    else if (maxPrice !== undefined)
      whereConditions['price'] = LessThanOrEqual(maxPrice);
    if (orderBy) {
      const [field, order] = orderBy.split('_');
      orderConditions[field] = order.toUpperCase();
    }
    console.log(whereConditions);
    console.log(orderConditions);
    return {
      relations: ['brand', 'category'],
      where: whereConditions,
      order: orderConditions,
    };
  }
}
