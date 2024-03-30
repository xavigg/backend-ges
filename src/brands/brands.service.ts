import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { ErrorHandler } from 'src/utils/error.handler';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    try {
      return this.brandsRepository.save(createBrandDto);
    } catch (error) {
      ErrorHandler.handleBadRequestError('Could not connect to the DB');
    }
  }

  async findAll(): Promise<Brand[]> {
    try {
      let brands = await this.brandsRepository.find();
      if (!brands.length) {
        ErrorHandler.handleNotFoundError('Error - No category found');
      }
      return brands;
    } catch (error) {
      ErrorHandler.handleServiceUnavailableError(error);
    }
  }

  async findByID(idbrand: number): Promise<Brand> {
    try {
      let brand = await this.brandsRepository.findOneBy({
        idbrand,
      });
      if (!brand) {
        ErrorHandler.handleNotFoundError('Error - No category found');
      }
      return brand;
    } catch (error) {
      ErrorHandler.handleServiceUnavailableError(error);
    }
  }

  async update(
    idbrand: number,
    updateBrandDto: UpdateBrandDto,
  ): Promise<Brand> {
    try {
      let toUpdate = await this.brandsRepository.findOne({
        where: { idbrand: idbrand },
      });
      let updated = Object.assign(toUpdate, updateBrandDto);
      return this.brandsRepository.save(updated);
    } catch (error) {
      ErrorHandler.handleBadRequestError('Brand ID was incorrectly formatted');
    }
  }

  async remove(idbrand: number): Promise<any> {
    try {
      return await this.brandsRepository.delete({ idbrand: idbrand });
    } catch (error) {
      ErrorHandler.handleBadRequestError('Brand ID was incorrectly formatted');
    }
  }
}
