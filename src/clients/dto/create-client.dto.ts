import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateClientDto {
  @IsString({ message: 'The field name is not a string' })
  @IsNotEmpty({ message: 'The field name cannot be empty' })
  @MinLength(3)
  @MaxLength(500)
  readonly name: string;

  @IsString({ message: 'The field lastName is not a string' })
  @IsNotEmpty({ message: 'The field lastName cannot be empty' })
  @MaxLength(500)
  readonly lastName: string;

  @IsString({ message: 'The field adress is not a string' })
  @MaxLength(500)
  readonly adress: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty({ message: 'The field email cannot be empty' })
  readonly email: string;

  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  @IsString({ message: 'The field phone number is not a string' })
  readonly phoneNumber: string;

  @MinLength(1)
  @MaxLength(50)
  @IsString({ message: 'The field document number is not a string' })
  readonly docNumber: string;

  @MinLength(1)
  @MaxLength(50)
  @IsString({ message: 'The field cuit is not a string' })
  readonly cuit: string;

  @IsNumber()
  readonly fiscalConditionId: number;
}
