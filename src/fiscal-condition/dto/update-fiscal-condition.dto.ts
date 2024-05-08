import { PartialType } from '@nestjs/swagger';
import { CreateFiscalConditionDto } from './create-fiscal-condition.dto';

export class UpdateFiscalConditionDto extends PartialType(CreateFiscalConditionDto) {}
