import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ErrorManager } from 'src/config/error.manager';
import { SearchDto } from './dto/search.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      return this.productsRepository.save(createProductDto);
    } catch (error) {
      throw new ServiceUnavailableException(
        error + ' / Could not connect to the DB',
      );
    }
  }

  private CheckIsNotFoundAndFail(products: Product[]) {
    if (!products.length) {
      throw new ErrorManager({
        type: 'NOT_FOUND',
        message: 'Error - No documents found',
      });
    }
  }

  async findByOptions(query: SearchDto): Promise<Product[]> {
    const { brand, category, minPrice, maxPrice } = query;
    try {
      let queryOptions: any = {
        relations: ['brand', 'category'],
        select: {
          brand: { name: true },
          category: { name: true },
        },
        where: {},
      };

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

      let products = await this.productsRepository.find(queryOptions);

      this.CheckIsNotFoundAndFail(products);

      return await products;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
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
      throw new BadRequestException('Product ID was incorrectly formatted');
    }
  }

  async remove(idproduct: number): Promise<any> {
    try {
      return await this.productsRepository.delete({ idproduct: idproduct });
    } catch (error) {
      throw new BadRequestException('Product ID was incorrectly formatted');
    }
  }
}
