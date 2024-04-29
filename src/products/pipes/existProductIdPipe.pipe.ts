import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ErrorHandler } from 'src/shared/error.handler';

@Injectable()
export class existProductIdPipe implements PipeTransform {
  constructor(
    @InjectRepository(Product)
    public productsRepository: Repository<Product>,
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      const result = await this.productsRepository.findOne({
        where: { productId: value },
      });
      if (!result) {
        throw new ErrorHandler({
          message: '[P] No product found with the given ID',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return value;
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }
}
