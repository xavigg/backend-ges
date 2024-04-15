import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ErrorHandler } from 'src/utils/error.handler';

@Injectable()
export class UsersService {
  configService: any;
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const email = createUserDto.email;
      const user = await this.usersRepository.findOneBy({ email });
      if (user) {
        ErrorHandler.handleBadRequestError('Email already exists');
      }
      const newUser = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      ErrorHandler.handleServiceUnavailableError(error.message);
    }
  }

  async findAll() {
    try {
      const users = await this.usersRepository.find();
      if (!users.length) {
        ErrorHandler.handleNotFoundError('Error - No users found');
      }
      return users;
    } catch (error) {
      ErrorHandler.handleServiceUnavailableError(error);
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOneBy({ email });
      if (!user) {
        ErrorHandler.handleBadRequestError('Invalid email or password');
      }
      return user;
    } catch (error) {
      ErrorHandler.handleServiceUnavailableError(error.message);
    }
  }

  async update(iduser: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: { iduser },
      });
      Object.assign(user, updateUserDto);
      return await this.usersRepository.save(user);
    } catch (error) {
      ErrorHandler.handleBadRequestError(
        'User ID was incorrectly formatted or does not exist',
      );
    }
  }

  async remove(iduser: number): Promise<void> {
    try {
      const result = await this.usersRepository.delete(iduser);
      if (result.affected === 0) {
        ErrorHandler.handleNotFoundError(`User with ID ${iduser} not found`);
      }
    } catch (error) {
      ErrorHandler.handleBadRequestError(
        'Product ID was incorrectly formatted or does not exist',
      );
    }
  }

}
