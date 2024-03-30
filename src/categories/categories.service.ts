import {
  Injectable,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ErrorHandler } from 'src/utils/error.handler';

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
      ErrorHandler.handleBadRequestError('Could not connect to the DB');
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      let categories = await this.categoriesRepository.find();
      if (!categories.length) {
        ErrorHandler.handleNotFoundError('Error - No category found');
      }
      return categories;
    } catch (error) {
      ErrorHandler.handleServiceUnavailableError(error);
    }
  }

  async findByID(idcategory: number): Promise<Category> {
    try {
      let category = await this.categoriesRepository.findOneBy({
        idcategory,
      });
      if (!category) {
        ErrorHandler.handleNotFoundError('Error - No category found');
      }
      return category;
    } catch (error) {
      ErrorHandler.handleBadRequestError(error)
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
      ErrorHandler.handleBadRequestError('Category ID was incorrectly formatted');
    }
  }

  async remove(idcategory: number): Promise<any> {
    try {
      return await this.categoriesRepository.delete({ idcategory: idcategory });
    } catch (error) {
      ErrorHandler.handleBadRequestError('Category ID was incorrectly formatted');
    }
  }
}
