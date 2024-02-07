import { 
    IsNotEmpty, 
    IsNumber, 
    IsOptional, 
    IsString 
} from 'class-validator';


export class CreateProductDto {

@IsNotEmpty({ message: 'The field name cannot be empty' })
@IsString()   
readonly name: string;

@IsNotEmpty({ message: 'The field price cannot be empty' })
@IsNumber()
readonly price: number;

@IsOptional()
@IsString()   
readonly details: string;

@IsNumber()
@IsOptional()
readonly warranty: number;

@IsOptional()
@IsString()   
readonly img_url: string;

@IsNumber()
readonly idcategory: number;

@IsNumber()
readonly idbrand: number;

}
