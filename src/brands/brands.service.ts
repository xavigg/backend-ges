import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { ErrorHandler } from 'src/shared/error.handler';
import { ExecutionResult } from 'src/shared/interfaces/ExecutionResult.interface';
import { checkDuplicateData } from 'src/shared/checkDuplicateData.shared';
import { findByIdOrName } from 'src/shared/findByIdOrName.shared';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<ExecutionResult> {
    try {
      const name = createBrandDto.name;
      await checkDuplicateData(this.brandsRepository, { name: name });
      const newBrand = this.brandsRepository.create(createBrandDto);
      const result = await this.brandsRepository.save(newBrand);
      return {
        success: true,
        message: 'Brand created successfully',
        data: result,
      };
    } catch (error) {
      ErrorHandler.createSignatureError(error);
    }
  }

  async findAll(): Promise<Brand[]> {
    try {
      let brands = await this.brandsRepository.find();
      if (brands.length === 0) {
        Logger.log('No brands found');
        return [];
      }
      return brands;
    } catch (error) {
      ErrorHandler.handleServiceUnavailableError(error);
    }
  }

  async findBrandByIdOrName(idOrName: string): Promise<Brand[]> {
    try {
      const brands = await findByIdOrName(this.brandsRepository, idOrName);
      return brands;
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }

  async findByID(brandId: number): Promise<Brand> {
    try {
      let brand = await this.brandsRepository.findOneBy({
        brandId,
      });
      if (!brand) {
        throw new ErrorHandler({
          message: 'No brands found with the given ID',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return brand;
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }

  async update(
    brandId: number,
    updateBrandDto: UpdateBrandDto,
  ): Promise<ExecutionResult> {
    try {
      let toUpdate = await this.brandsRepository.findOne({
        where: { brandId: brandId },
      });
      let updated = Object.assign(toUpdate, updateBrandDto);
      this.brandsRepository.save(updated);
      return {
        success: true,
        message: 'Brand updated successfully',
        data: updated,
      };
    } catch (error) {
      ErrorHandler.handleBadRequestError('Brand ID was incorrectly formatted');
    }
  }

  async remove(brandId: number): Promise<ExecutionResult> {
    try {
      const result = await this.brandsRepository.delete({
        brandId: brandId,
      });
      if (result.affected === 0) {
        throw new ErrorHandler({
          message: `Brand with ID ${brandId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return { success: true, message: 'Brand deleted successfully' };
    } catch (error) {
      throw ErrorHandler.handleBadRequestError(
        'Brand ID was incorrectly formatted',
      );
    }
  }

  async softDelete(brandId: number): Promise<ExecutionResult> {
    try {
      const result = await this.brandsRepository.softDelete(brandId);
      if (result.affected === 0) {
        throw new ErrorHandler({
          message: `Product with ID ${brandId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return { success: true, message: 'Brand deleted successfully' };
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }

  async restoreDeletedProduct(brandId: number): Promise<ExecutionResult> {
    try {
      const result = await this.brandsRepository.restore(brandId);
      if (result.affected === 0) {
        throw new ErrorHandler({
          message: `Brand with ID ${brandId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return { success: true, message: 'Brand restored successfully' };
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }
}
