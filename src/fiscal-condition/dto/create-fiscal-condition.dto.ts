import { IsEnum, IsNotEmpty } from 'class-validator';
import {
  billTypeEnum,
  fiscalConditionEnum,
} from '../enum/fiscal-condition.enum';

export class CreateFiscalConditionDto {
  @IsEnum(fiscalConditionEnum)
  @IsNotEmpty({ message: 'The field condition cannot be empty' })
  readonly condition: string;

  @IsEnum(billTypeEnum)
  @IsNotEmpty({ message: 'The field bill type cannot be empty' })
  readonly billType: string;
}
