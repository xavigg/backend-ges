import { HttpStatus } from '@nestjs/common';
import { ErrorHandler } from './error.handler';
import { FindManyOptions, Like, Repository } from 'typeorm';

export async function findByIdOrName(
  repo: Repository<any>,
  idOrName: string,
): Promise<any[]> {
  const primaryKey = repo.metadata.primaryColumns[0].propertyName;
  const queryOptions = buildIdOrNameSearchOptions(idOrName, primaryKey);
  const search = await repo.find(queryOptions);
  if (search.length === 0) {
    throw new ErrorHandler({
      message: 'Data not found',
      statusCode: HttpStatus.NOT_FOUND,
    });
  }
  return search;
}

function buildIdOrNameSearchOptions(
  idOrName: string,
  primaryKey: string,
): FindManyOptions<any> {
  const id = parseInt(idOrName, 10);
  const nameBrand = `%${idOrName.toUpperCase()}%`;

  let whereConditions = [];

  //CHECK IF NUMERIC
  if (/^\d+$/.test(idOrName)) {
    if (!isNaN(id)) {
      whereConditions.push({ [primaryKey]: id });
    }
  } else {
    if (idOrName) {
      whereConditions.push({ name: Like(nameBrand) });
    }
  }

  const finalQuery = {
    where: whereConditions,
  };
  return finalQuery;
}
