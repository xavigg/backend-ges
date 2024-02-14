import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Between, Repository } from 'typeorm';
import { ErrorManager } from 'src/config/error.manager';
import { Brand } from 'src/brands/entities/brand.entity';

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

  private FindOptionsWithWhere(
    field: string,
    subfield: string,
    IdOrName: number | string,
    minPrice?: number,
    maxPrice?: number,
  ) {
    let options = {
      where: {
        [field]: { [subfield]: IdOrName },
      },
      relations: ['category', 'brand'],
      select: {
        category: {
          name: true,
        },
        brand: {
          name: true,
        },
      },
    };
    return options;
  }

  async findAll(): Promise<Product[]> {
    try {
      let products = await this.productsRepository.find({
        relations: ['category', 'brand'],
        select: {
          category: {
            name: true,
          },
          brand: {
            name: true,
          },
        },
      });
      this.CheckIsNotFoundAndFail(products);
      return products;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findWithRangePrice(
    minPrice: number,
    maxPrice: number,
  ): Promise<Product[]> {
    try {
      let products = await this.productsRepository.find({
        where: {
          price: Between(minPrice, maxPrice),
        },
        relations: ['category', 'brand'],
        select: {
          category: {
            name: true,
          },
          brand: {
            name: true,
          },
        },
      });
      this.CheckIsNotFoundAndFail(products);
      return products;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findById(idproduct: number): Promise<Product> {
    try {
      let product = await this.productsRepository.findOne({
        where: {
          idproduct: idproduct,
        },
        relations: ['category', 'brand'],
        select: {
          category: {
            idcategory: true,
            name: true,
          },
          brand: {
            idbrand: true,
            name: true,
          },
        },
      });
      if (!product) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Error - No documents found',
        });
      }
      return product;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findByBrandId(brandID: number): Promise<Product[]> {
    try {
      const products = await this.productsRepository.find(
        this.FindOptionsWithWhere('brand', 'idbrand', brandID),
      );
      this.CheckIsNotFoundAndFail(products);
      return products;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findByOptions(
    brand: string,
    category: string,
    minPrice: number,
    maxPrice: number,
  ): Promise<Product[]> {
    try {
      let query = await this.productsRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.category', 'category');
      if (brand) {
        query.where('brand.name = :brand', { brand });
      }
      if (category) {
        query.andWhere('category.name = :category', { category });
      }
      if (minPrice) {
        query.andWhere('product.price >= :minPrice', { minPrice });
      }
      if (maxPrice) {
        query.andWhere('product.price <= :maxPrice', { maxPrice });
      }
      const products = await query.getMany();
      this.CheckIsNotFoundAndFail(products);
      return await products;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findByBrandName(brandName: string): Promise<Product[]> {
    try {
      const products = await this.productsRepository.find(
        this.FindOptionsWithWhere('brand', 'name', brandName.toUpperCase()),
      );
      this.CheckIsNotFoundAndFail(products);
      return products;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findByCategoryId(categoryID: number): Promise<Product[]> {
    try {
      const products = await this.productsRepository.find(
        this.FindOptionsWithWhere('category', 'idcategory', categoryID),
      );
      this.CheckIsNotFoundAndFail(products);
      return products;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findByCategoryName(categoryName: string): Promise<Product[]> {
    try {
      const products = await this.productsRepository.find(
        this.FindOptionsWithWhere(
          'category',
          'name',
          categoryName.toUpperCase(),
        ),
      );
      this.CheckIsNotFoundAndFail(products);
      return products;
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
