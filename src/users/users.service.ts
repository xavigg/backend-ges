import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ErrorHandler, ExecutionResult, checkDuplicateData } from 'src/shared';

@Injectable()
export class UsersService {
  configService: any;
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<ExecutionResult> {
    try {
      const email = createUserDto.email;
      await checkDuplicateData(this.usersRepository, { email: email });
      const newUser = this.usersRepository.create(createUserDto);
      const result = await this.usersRepository.save(newUser);
      return { success: true, message: 'User created', data: result };
    } catch (error) {
      ErrorHandler.handleServiceUnavailableError(error.message);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.usersRepository.find();
      if (users.length === 0) {
        Logger.log('No users found');
        return [];
      }
      return users;
    } catch (error) {
      ErrorHandler.handleNotFoundError(error.message);
    }
  }

  async findById(userId: number): Promise<User> {
    try {
      let user = await this.usersRepository.findOneBy({
        userId,
      });
      if (!user) {
        throw new ErrorHandler({
          message: 'No user found with the given ID',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return user;
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: email },
      });
      if (!user) {
        ErrorHandler.handleBadRequestError('Invalid email or password');
      }
      return user;
    } catch (error) {
      ErrorHandler.handleServiceUnavailableError(error.message);
    }
  }

  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ExecutionResult> {
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: { userId },
      });
      Object.assign(user, updateUserDto);
      const result = await this.usersRepository.save(user);
      return { success: true, message: 'User updated', data: result };
    } catch (error) {
      ErrorHandler.handleBadRequestError(
        'User ID was incorrectly formatted or does not exist',
      );
    }
  }

  async remove(userId: number): Promise<void> {
    try {
      const result = await this.usersRepository.delete(userId);
      if (result.affected === 0) {
        ErrorHandler.handleNotFoundError(`User with ID ${userId} not found`);
      }
    } catch (error) {
      ErrorHandler.handleBadRequestError(
        'Product ID was incorrectly formatted or does not exist',
      );
    }
  }
}
