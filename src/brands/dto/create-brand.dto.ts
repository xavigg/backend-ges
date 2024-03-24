import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty({ message: 'The field name cannot be empty' })
  @IsString({ message: 'The field name is not a string' })
  readonly name: string;
}
