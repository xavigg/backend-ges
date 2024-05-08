import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHandler, ExecutionResult, checkDuplicateData } from 'src/shared';
import { create } from 'domain';

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async createClient(createClientDto: CreateClientDto): Promise<ExecutionResult> {
    try {
      console.log(createClientDto)
      const docNumber = createClientDto.docNumber;
      const email = createClientDto.email;
      await checkDuplicateData(this.clientRepository, { email: email, docNumber: docNumber });
      const newClient = this.clientRepository.create(createClientDto);
      const result = await this.clientRepository.save(newClient);
      return { success: true, message: 'Client created', data: result };
    } catch (error) {
      ErrorHandler.handleServiceUnavailableError(error.message);
    }
  }

  async findAll(): Promise<Client[]> {
    try {
      const clients = await this.clientRepository.find(this.RelationsAndFields());
      if (clients.length === 0) {
        return [];
      }
      return clients;
    } catch (error) {
      ErrorHandler.handleNotFoundError(error.message);
    }
  }

  async findById(clientId: number): Promise<Client> {
    try {
      let client = await this.clientRepository.findOneBy({
        clientId,
      });
      if (!client) {
        throw new ErrorHandler({
          message: 'No client found with the given ID',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return client;
    } catch (error) {
      throw ErrorHandler.createSignatureError(error);
    }
  }

  async update(
    clientId: number,
    updateClientDto: UpdateClientDto,
  ): Promise<ExecutionResult> {
    try {
      const client = await this.clientRepository.findOneOrFail({
        where: { clientId },
      });
      Object.assign(client, updateClientDto);
      const result = await this.clientRepository.save(client);
      return { success: true, message: 'Client updated', data: result };
    } catch (error) {
      ErrorHandler.handleBadRequestError(
        'Client ID was incorrectly formatted or does not exist',
      );
    }
  }

  async remove(clientId: number): Promise<void> {
    try {
      const result = await this.clientRepository.delete(clientId);
      if (result.affected === 0) {
        ErrorHandler.handleNotFoundError(`Client with ID ${clientId} not found`);
      }
    } catch (error) {
      ErrorHandler.handleBadRequestError(
        'Client ID was incorrectly formatted or does not exist',
      );
    }
  }

  private RelationsAndFields() {
    const query = {
      relations: ['fiscalCondition'],
      select: { fiscalCondition: { condition: true, billType: true }},	
    };
    return query;
  }
}
