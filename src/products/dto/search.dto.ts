import { IsOptional, IsNumber, IsString, Min, Validate, IsEnum } from 'class-validator';
import { MinMaxPriceValidator } from '../validators/minMaxPrice.validator';

export enum OrderBy {
    PRICE_ASC = 'price_asc',
    PRICE_DESC = 'price_desc',
    NAME_ASC = 'name_asc',
    NAME_DESC = 'name_desc'
  }

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
    @IsEnum(OrderBy)
    orderBy?: OrderBy;

}