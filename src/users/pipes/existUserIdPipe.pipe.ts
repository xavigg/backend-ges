import { ArgumentMetadata, BadRequestException, HttpStatus, Injectable, Logger, PipeTransform } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ErrorHandler } from "src/shared/error.handler";
import { User } from "../entities/user.entity";

@Injectable()
export class existUserIdPipe implements PipeTransform {

    constructor(@InjectRepository(User)
    public usersRepository: Repository<User>) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        try {
          const result = await this.usersRepository.findOne({
            where: { userId: value },
          });
          if (!result) {
            throw new ErrorHandler({
              message: '[P] No user found with the given ID',
              statusCode: HttpStatus.NOT_FOUND,
            });
          }
          return value;
        } catch (error) {
          throw ErrorHandler.createSignatureError(error);
        }
      }
    }
