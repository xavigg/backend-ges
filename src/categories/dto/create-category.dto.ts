import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {

@IsNotEmpty({ message: 'The field name cannot be empty' })
@IsString()   
readonly name: string;

}
