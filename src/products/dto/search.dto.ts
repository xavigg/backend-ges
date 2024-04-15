import { IsOptional, IsNumber, IsString, Min, Validate, IsEnum } from 'class-validator';
import { MinMaxPriceValidator } from '../validators/minMaxPrice.validator';
import { SearchOrderBy } from 'src/shared/types/shared.types';
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

    @IsOptional()
    @IsEnum(SearchOrderBy)
    orderBy: SearchOrderBy;
    

}