import { IsOptional, IsNumber, IsString, Min, Validate } from 'class-validator';
import { MinMaxPriceValidator } from '../validators/minMaxPrice.validator';

export class SearchDto {
    @IsOptional()
    @IsString()
    brand?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Validate(MinMaxPriceValidator)
    maxPrice?: number;

}