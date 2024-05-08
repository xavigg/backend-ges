import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateFiscalConditionDto } from './dto/create-fiscal-condition.dto';
import { UpdateFiscalConditionDto } from './dto/update-fiscal-condition.dto';
import { Repository } from 'typeorm';
import { FiscalCondition } from './entities/fiscal-condition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHandler, ExecutionResult, checkDuplicateData } from 'src/shared';

@Injectable()
export class FiscalConditionService {

  constructor(
    @InjectRepository(FiscalCondition)
    private readonly fiscalConditionRepository: Repository<FiscalCondition>
  ) {}

  async create(createFiscalConditionDto: CreateFiscalConditionDto): Promise<ExecutionResult> {
    try {
      const condition = createFiscalConditionDto.condition;
      await checkDuplicateData(this.fiscalConditionRepository, { condition: condition });
      const newFiscalCondition = this.fiscalConditionRepository.create(createFiscalConditionDto);
      const result = await this.fiscalConditionRepository.save(newFiscalCondition);
      return { success: true, message: 'Fiscal condition created', data: result };
    } catch (error) {
      ErrorHandler.handleServiceUnavailableError(error.message);
    }
  }

  async findAll(): Promise<FiscalCondition[]> {
    try {
      const fiscalCondition = await this.fiscalConditionRepository.find();
      if (fiscalCondition.length === 0) {
        return [];
      }
      return fiscalCondition;
    } catch (error) {
      ErrorHandler.handleNotFoundError(error.message);
    }
  }

  async findById(fiscalConditionId: number): Promise<FiscalCondition> {
    try {
      let fiscalCondition = await this.fiscalConditionRepository.findOneBy({
        fiscalConditionId,
      });
      if (!fiscalCondition) {
        throw new ErrorHandler({
          message: 'No fiscal condition found with the given ID',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return fiscalCondition;
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }

  async update(
    fiscalConditionId: number,
    updateFiscalConditionDto: UpdateFiscalConditionDto,
  ): Promise<ExecutionResult> {
    try {
      const fiscalCondition = await this.fiscalConditionRepository.findOneOrFail({
        where: { fiscalConditionId },
      });
      Object.assign(fiscalCondition, updateFiscalConditionDto);
      const result = await this.fiscalConditionRepository.save(fiscalCondition);
      return { success: true, message: 'Fiscal condition updated', data: result };
    } catch (error) {
      ErrorHandler.handleBadRequestError(
        'Fiscal condition ID was incorrectly formatted or does not exist',
      );
    }
  }

  async remove(fiscalConditionId: number): Promise<void> {
    try {
      const result = await this.fiscalConditionRepository.delete(fiscalConditionId);
      if (result.affected === 0) {
        ErrorHandler.handleNotFoundError(`Fiscal condition with ID ${fiscalConditionId} not found`);
      }
    } catch (error) {
      ErrorHandler.handleBadRequestError(
        'Fiscal condition ID was incorrectly formatted or does not exist',
      );
    }
  }
}
