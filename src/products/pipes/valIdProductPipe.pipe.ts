import { ArgumentMetadata, BadRequestException, Injectable, Logger, PipeTransform } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../entities/product.entity";
import { ErrorHandler } from "src/utils/error.handler";

@Injectable()
export class ValIdProductPipe implements PipeTransform {

    constructor(@InjectRepository(Product)
    public productsRepository: Repository<Product>) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        try {
            await this.productsRepository.findOneOrFail(value);
        }catch(err) {
            ErrorHandler.handleBadRequestError("ID NOT FOUND")
        }

        return value;
    }

}