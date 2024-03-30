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
import { SearchDto } from './dto/search.dto';
import { OrderBy } from './dto/search.dto';

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

  private CheckIsNotFoundAndFail(products: Product[]) {
    if (!products.length) {
      throw new ErrorHandler({ 
        type: 'Not Found',
        message: 'No products found',
        statusCode: HttpStatus.NOT_FOUND,
      })
    }
  }

  async findByOptions(query: SearchDto): Promise<Product[]> {
    const { brand, category, minPrice, maxPrice, orderBy } = query;
    try {
      // CHECK IF MINPRICE IS MAYOR WHO MAXPRICE AND THROW
      if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
        throw new Error('minPrice cannot be greater than maxPrice');
      }

      let queryOptions: any = {
        relations: ['brand', 'category'],
        select: {
          brand: { name: true, idbrand: true },
          category: { name: true, idcategory: true },
        },
        where: {},
        order: {},
      };

      // SEARCH CONDITIONS
      if (brand) {
        queryOptions.where.brand = { name: brand };
      }
      if (category) {
        queryOptions.where.category = { name: category };
      }
      if (minPrice && maxPrice) {
        queryOptions.where.price = Between(minPrice, maxPrice);
      } else if (minPrice) {
        queryOptions.where.price = MoreThanOrEqual(minPrice);
      } else if (maxPrice) {
        queryOptions.where.price = LessThanOrEqual(maxPrice);
      }

      // ORDER CONDITIONS 
      if (query.orderBy === OrderBy.PRICE_ASC) {
        queryOptions.order.price = 'ASC';
      } else if (query.orderBy === OrderBy.PRICE_DESC) {
        queryOptions.order.price = 'DESC';
      }

      if (query.orderBy === OrderBy.NAME_ASC) {
        queryOptions.order.name = 'ASC' ;
      } else if (query.orderBy === OrderBy.NAME_DESC) {
        queryOptions.order.name = 'DESC' ;
      }

      const products = await this.productsRepository.find(queryOptions);

      this.CheckIsNotFoundAndFail(products);
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
