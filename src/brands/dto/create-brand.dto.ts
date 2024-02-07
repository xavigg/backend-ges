import { IsNotEmpty, IsString } from "class-validator";

export class CreateBrandDto {

@IsNotEmpty({ message: 'The field name cannot be empty' })
@IsString()   
readonly name: string;

}
