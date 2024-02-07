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
      throw new ServiceUnavailableException(
        error + ' / Could not connect to the DB',
      );
    }
  }

  async findAll(): Promise<Brand[]> {
    try {
      let brands = await this.brandsRepository.find();
      if (!brands.length) {
        throw new ServiceUnavailableException('Error - No documents found');
      }
      return brands;
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  async findByID(idbrand: number): Promise<Brand> {
    try {
      let brand = await this.brandsRepository.findOneBy({
        idbrand,
      });
      if (!brand) {
        throw new ServiceUnavailableException('Error - No brand found');
      }
      return brand;
    } catch (error) {
      throw new BadRequestException(error);
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
      throw new BadRequestException('Brand ID was incorrectly formatted');
    }
  }

  async remove(idbrand: number): Promise<any> {
    try {
      return await this.brandsRepository.delete({ idbrand: idbrand });
    } catch (error) {
      throw new BadRequestException('Brand ID was incorrectly formatted');
    }
  }
}
