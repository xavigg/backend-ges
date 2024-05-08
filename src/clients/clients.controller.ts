import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// Swagger
@ApiTags('Clients')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
// Controller
@UseInterceptors(ClassSerializerInterceptor)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiOperation({ summary: 'Create a new client' })
  @ApiBadRequestResponse({ description: 'Document Number already exists' })
  @ApiCreatedResponse({ description: 'Client Created' })
  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return await this.clientsService.createClient(createClientDto);
  }

  @ApiOperation({ summary: 'Find all clients' })
  @ApiOkResponse({ description: 'Show all clients' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  @Get()
  async findAll() {
    return await this.clientsService.findAll();
  }

  @ApiOperation({ summary: 'Find client by Id' })
  @ApiNotFoundResponse({ description: 'Client not found' })
  @ApiOkResponse({ description: 'Show client by id' })
  @Get(':clientId')
  async findByID(@Param('clientId', ParseIntPipe) clientId: number) {
    return await this.clientsService.findById(+clientId);
  }

  @ApiOperation({ summary: 'Update a client' })
  @ApiBadRequestResponse({
    description: 'Client ID was incorrectly formatted or does not exist',
  })
  @ApiOkResponse({ description: 'Client Updated' })
  @Patch(':clientId')
  async update(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return await this.clientsService.update(+clientId, updateClientDto);
  }

  @ApiOperation({ summary: 'Remove client' })
  @ApiBadRequestResponse({ description: 'Client ID was incorrectly formatted' })
  @ApiOkResponse({ description: 'Client deleted' })
  @Delete(':clientId')
  async remove(@Param('clientId', ParseIntPipe) clientId: number) {
    return await this.clientsService.remove(+clientId);
  }
}
