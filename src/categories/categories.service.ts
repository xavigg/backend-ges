import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import {
  ErrorHandler,
  ExecutionResult,
  checkDuplicateData,
  findByIdOrName,
} from 'src/shared';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<ExecutionResult> {
    try {
      const name = createCategoryDto.name;
      await checkDuplicateData(this.categoriesRepository, { name: name });
      const newCategory = this.categoriesRepository.create(createCategoryDto);
      const result = await this.categoriesRepository.save(newCategory);
      return {
        success: true,
        message: 'Category created successfully',
        data: result,
      };
    } catch (error) {
      ErrorHandler.createSignatureError(error);
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      let categories = await this.categoriesRepository.find();
      if (categories.length === 0) {
        Logger.log('No categories found');
        return [];
      }
      return categories;
    } catch (error) {
      ErrorHandler.handleServiceUnavailableError(error);
    }
  }

  async findCategoryByIdOrName(idOrName: string): Promise<Category[]> {
    try {
      const categories = await findByIdOrName(
        this.categoriesRepository,
        idOrName,
      );
      return categories;
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }

  async findByID(categoryId: number): Promise<Category> {
    try {
      let category = await this.categoriesRepository.findOneBy({
        categoryId,
      });
      if (!category) {
        throw new ErrorHandler({
          message: 'No categories found with the given ID',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return category;
    } catch (error) {
      ErrorHandler.handleBadRequestError(error);
    }
  }

  async update(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ExecutionResult> {
    try {
      let toUpdate = await this.categoriesRepository.findOne({
        where: { categoryId: categoryId },
      });
      let updated = Object.assign(toUpdate, updateCategoryDto);
      this.categoriesRepository.save(updated);
      return {
        success: true,
        message: 'Category updated successfully',
        data: updated,
      };
    } catch (error) {
      ErrorHandler.handleBadRequestError(
        'Category ID was incorrectly formatted',
      );
    }
  }

  async remove(categoryId: number): Promise<ExecutionResult> {
    try {
      const result = await this.categoriesRepository.delete({
        categoryId: categoryId,
      });
      if (result.affected === 0) {
        throw new ErrorHandler({
          message: `Category with ID ${categoryId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return { success: true, message: 'Category deleted successfully' };
    } catch (error) {
      throw ErrorHandler.handleBadRequestError(
        'Category ID was incorrectly formatted',
      );
    }
  }

  async softDelete(categoryId: number): Promise<ExecutionResult> {
    try {
      const result = await this.categoriesRepository.softDelete(categoryId);
      if (result.affected === 0) {
        throw new ErrorHandler({
          message: `Product with ID ${categoryId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return { success: true, message: 'Category deleted successfully' };
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }

  async restoreDeletedProduct(categoryId: number): Promise<ExecutionResult> {
    try {
      const result = await this.categoriesRepository.restore(categoryId);
      if (result.affected === 0) {
        throw new ErrorHandler({
          message: `Category with ID ${categoryId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return { success: true, message: 'Category restored successfully' };
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }
}
