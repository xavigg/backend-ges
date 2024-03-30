import { HttpException, HttpStatus } from '@nestjs/common';

interface ErrorOptions {
  type: string;
  message: string;
  statusCode?: HttpStatus;
}

export class ErrorHandler extends Error {
  statusCode: HttpStatus; // Definir la propiedad statusCode

  constructor({ type, message, statusCode }: ErrorOptions) {
    super(`${type} / ${message}`);
    this.statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR; // Inicializar statusCode con INTERNAL_SERVER_ERROR si no se proporciona
  }

  public static createSignatureError({ type, message, statusCode }: ErrorOptions) {
    throw new HttpException(message, statusCode || HttpStatus.INTERNAL_SERVER_ERROR); // Usar statusCode proporcionado o INTERNAL_SERVER_ERROR si no se proporciona
  }

  public static handleNotFoundError(message: string) {
    throw new HttpException(message, HttpStatus.NOT_FOUND);
  }

  public static handleBadRequestError(message: string) {
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
  }

  public static handleInternalServerError(message: string) {
    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  } 

  public static handleServiceUnavailableError(message: string) { 
    throw new HttpException(message, HttpStatus.SERVICE_UNAVAILABLE);
  }
}