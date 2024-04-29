import { HttpStatus, Injectable, Logger } from '@nestjs/common';
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
import { ErrorHandler } from 'src/shared/error.handler';
import { ProductFilterOptions } from './interface/products.interface';
import {
  ExecutionResult,
  checkDuplicateData,
  findByIdOrName,
} from 'src/shared';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ExecutionResult> {
    try {
      const name = createProductDto.name;
      await checkDuplicateData(this.productsRepository, { name: name });
      const newProduct = this.productsRepository.create(createProductDto);
      const result = await this.productsRepository.save(newProduct);
      return {
        success: true,
        message: 'Product created successfully',
        data: result,
      };
    } catch (error) {
      ErrorHandler.createSignatureError(error);
    }
  }

  async update(
    productId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ExecutionResult> {
    try {
      let toUpdate = await this.productsRepository.findOne({
        where: { productId: productId },
      });
      let updated = Object.assign(toUpdate, updateProductDto);
      this.productsRepository.save(updated);
      return {
        success: true,
        message: 'Product updated successfully',
        data: updated,
      };
    } catch (error) {
      ErrorHandler.handleBadRequestError(
        'Product ID was incorrectly formatted',
      );
    }
  }

  async remove(productId: number): Promise<ExecutionResult> {
    try {
      const result = await this.productsRepository.delete({
        productId: productId,
      });
      if (result.affected === 0) {
        throw new ErrorHandler({
          message: `Product with ID ${productId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      throw ErrorHandler.handleBadRequestError(
        'Product ID was incorrectly formatted',
      );
    }
  }

  async softDelete(productId: number): Promise<ExecutionResult> {
    try {
      const result = await this.productsRepository.softDelete(productId);
      if (result.affected === 0) {
        throw new ErrorHandler({
          message: `Product with ID ${productId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }

  async restoreDeletedProduct(productId: number): Promise<ExecutionResult> {
    try {
      const result = await this.productsRepository.restore(productId);
      if (result.affected === 0) {
        throw new ErrorHandler({
          message: `Product with ID ${productId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return { success: true, message: 'Product restored successfully' };
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      let products = await this.productsRepository.find({
        relations: ['category', 'brand'],
      });
      if (products.length === 0) {
        Logger.log('No products found');
        return [];
      }
      return products;
    } catch (error) {
      ErrorHandler.handleBadRequestError(error);
    }
  }

  async findProductByID(productId: number): Promise<Product> {
    try {
      let product = await this.productsRepository.findOne({
        where: { productId: productId },
        ...this.ProductRelationsAndFields(),
      });
      if (!product) {
        throw new ErrorHandler({
          message: 'No product found with the given ID',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return product;
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }

  async findProductByIdOrName(idOrName: string): Promise<Product[]> {
    try {
      const products = await findByIdOrName(this.productsRepository, idOrName);
      return products;
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }

  async findProductByFilterOptions(query: ProductFilterOptions): Promise<Product[]> {
    const queryOptions = this.buildProductQueryFilterOptions(query);
    try {
      const products = await this.productsRepository.find(queryOptions);
      if (products.length === 0) {
        throw new ErrorHandler({
          message: 'No products found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return products;
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }

  private buildProductQueryFilterOptions(
    query: ProductFilterOptions,
  ): FindManyOptions<Product> {
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
    const finalQuery = {
      ...this.ProductRelationsAndFields(),
      where: whereConditions,
      order: orderConditions,
    };
    return finalQuery;
  }

  private ProductRelationsAndFields() {
    const query = {
      relations: ['category', 'brand'],
      select: {
        category: { categoryId: true, name: true },
        brand: { brandId: true, name: true },
      },
    };
    return query;
  }
}
