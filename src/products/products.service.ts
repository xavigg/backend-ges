import {
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ErrorHandler } from 'src/utils/error.handler';
import { ProductResponse, ProductQuery } from './interface/products.interface';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      return this.productsRepository.save(createProductDto);
    } catch (error) {
      ErrorHandler.handleBadRequestError('Could not connect to the DB');
    }
  }

  private checkIsNotFoundAndFail(products: Product[]) {
    if (!products.length) {
      throw new ErrorHandler({
        type: 'NOT_FOUND',
        message: 'No products found',
        statusCode: HttpStatus.NOT_FOUND,
      })
    }
  }

  async findByOptions(query: ProductQuery): Promise<Product[]> {
    const { brand, category, minPrice, maxPrice, orderBy } = query;

    const queryOptions: FindManyOptions<Product> = {
      relations: ['brand', 'category'],
      select: {
        brand: { name: true, idbrand: true },
        category: { name: true, idcategory: true },
      },
      where: {},
      order: {},
    };

    try {
      // SEARCH CONDITIONS
      if (brand) {
        queryOptions.where = { ...queryOptions.where, brand: { name: brand } };
      }
      if (category) {
        queryOptions.where = { ...queryOptions.where, category: { name: category } };
      }
      if (minPrice !== undefined && maxPrice !== undefined) {
        queryOptions.where = { ...queryOptions.where, price: Between(minPrice, maxPrice) };
      } else if (minPrice !== undefined) {
        queryOptions.where = { ...queryOptions.where, price: MoreThanOrEqual(minPrice) };
      } else if (maxPrice !== undefined) {
        queryOptions.where = { ...queryOptions.where, price: LessThanOrEqual(maxPrice) };
      }

      // ORDER CONDITIONS
      const [field, order] = orderBy.split("_")
      queryOptions.order[field] = order;

      const products = await this.productsRepository.find(queryOptions);
      this.checkIsNotFoundAndFail(products);
      
      return await products;

    } catch (error) {
      throw ErrorHandler.createSignatureError(error)
    }
  }

  async update(
    idproduct: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      let toUpdate = await this.productsRepository.findOne({
        where: { idproduct: idproduct },
      });
      let updated = Object.assign(toUpdate, updateProductDto);
      return this.productsRepository.save(updated);
    } catch (error) {
      ErrorHandler.handleBadRequestError('Product ID was incorrectly formatted');
    }
  }

  async remove(idproduct: number): Promise<any> {
    try {
      return await this.productsRepository.delete({ idproduct: idproduct });
    } catch (error) {
      ErrorHandler.handleBadRequestError('Product ID was incorrectly formatted');
    }
  }
}
