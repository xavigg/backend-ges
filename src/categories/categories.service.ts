import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      return this.categoriesRepository.save(createCategoryDto);
    } catch (error) {
      throw new ServiceUnavailableException(
        error + ' / Could not connect to the DB',
      );
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      let categories = await this.categoriesRepository.find();
      if (!categories.length) {
        throw new ServiceUnavailableException('Error - No documents found');
      }
      return categories;
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  async findByID(idcategory: number): Promise<Category> {
    try {
      let category = await this.categoriesRepository.findOneBy({
        idcategory,
      });
      if (!category) {
        throw new ServiceUnavailableException('Error - No category found');
      }
      return category;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    idcategory: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      let toUpdate = await this.categoriesRepository.findOne({
        where: { idcategory: idcategory },
      });
      let updated = Object.assign(toUpdate, updateCategoryDto);
      return this.categoriesRepository.save(updated);
    } catch (error) {
      throw new BadRequestException('Category ID was incorrectly formatted');
    }
  }

  async remove(idcategory: number): Promise<any> {
    try {
      return await this.categoriesRepository.delete({ idcategory: idcategory });
    } catch (error) {
      throw new BadRequestException('Category ID was incorrectly formatted');
    }
  }
}
