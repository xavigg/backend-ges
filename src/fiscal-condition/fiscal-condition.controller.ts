import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
} from '@nestjs/common';
import { FiscalConditionService } from './fiscal-condition.service';
import { CreateFiscalConditionDto } from './dto/create-fiscal-condition.dto';
import { UpdateFiscalConditionDto } from './dto/update-fiscal-condition.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiServiceUnavailableResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

// Swagger
@ApiTags('Fiscal Condition')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
// Controller
@UseInterceptors(ClassSerializerInterceptor)
@Controller('fiscal-condition')
export class FiscalConditionController {
  constructor(
    private readonly fiscalConditionService: FiscalConditionService,
  ) {}

  @ApiOperation({ summary: 'Create a new fiscal condition' })
  @ApiBadRequestResponse({ description: 'Condition already exists' })
  @ApiCreatedResponse({ description: 'Fiscal condition created' })
  @Post()
  async create(@Body() createFiscalConditionDto: CreateFiscalConditionDto) {
    return await this.fiscalConditionService.create(createFiscalConditionDto);
  }

  @ApiOperation({ summary: 'Find all fiscal condition' })
  @ApiOkResponse({ description: 'Show all fiscal condition' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  @Get()
  async findAll() {
    return await this.fiscalConditionService.findAll();
  }

  @ApiOperation({ summary: 'Find fiscal condition by Id' })
  @ApiNotFoundResponse({ description: 'Fiscal condition not found' })
  @ApiOkResponse({ description: 'Show fiscal condition by id' })
  @Get(':fiscalConditionId')
  async findByID(@Param('fiscalConditionId', ParseIntPipe) fiscalConditionId: number) {
    return await this.fiscalConditionService.findById(+fiscalConditionId);
  }

  @ApiOperation({ summary: 'Update a fiscal condition' })
  @ApiBadRequestResponse({
    description: 'Fiscal condition ID was incorrectly formatted or does not exist',
  })
  @ApiOkResponse({ description: 'Fiscal condition Updated' })
  @Patch(':fiscalConditionId')
  async update(
    @Param('fiscalConditionId', ParseIntPipe) fiscalConditionId: number,
    @Body() updateFiscalConditionDto: UpdateFiscalConditionDto,
  ) {
    return await this.fiscalConditionService.update(+fiscalConditionId, updateFiscalConditionDto);
  }

  @ApiOperation({ summary: 'Remove fiscal condition' })
  @ApiBadRequestResponse({ description: 'Fiscal condition ID was incorrectly formatted' })
  @ApiOkResponse({ description: 'Fiscal condition deleted' })
  @Delete(':fiscalConditionId')
  async remove(@Param('fiscalConditionId', ParseIntPipe) fiscalConditionId: number) {
    return await this.fiscalConditionService.remove(+fiscalConditionId);
  }
}
