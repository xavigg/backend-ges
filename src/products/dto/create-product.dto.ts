import { 
    IsNotEmpty, 
    IsNumber, 
    IsOptional, 
    IsString 
} from 'class-validator';


export class CreateProductDto {

@IsNotEmpty()
@IsString()   
readonly name: string;

@IsNotEmpty()
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
