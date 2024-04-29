import { Repository } from 'typeorm';
import { ErrorHandler } from './error.handler';
import { HttpStatus } from '@nestjs/common';

interface SearchParams {
  name?: string;
  id?: number;
  email?: string;
}

export async function checkDuplicateData(
  repo: Repository<any>,
  param: SearchParams,
): Promise<void> {
  const { name, id, email } = param;
  const checks = [];

  if (name) {
    checks.push(checkIfExists(repo, 'name', name));
  }

  if (id) {
    checks.push(
      checkIfExists(repo, repo.metadata.primaryColumns[0].propertyName, id),
    );
  }

  if (email) {
    checks.push(checkIfExists(repo, 'email', email));
  }

  const results = await Promise.all(checks);
  results.forEach((result) => {
    if (result.exists) {
      throw new ErrorHandler({
        message: `${result.value} already exists`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  });
}

async function checkIfExists(
  repo: Repository<any>,
  field: string,
  value: string | number,
): Promise<{ exists: boolean; field: string; value: string | number }> {
  const data = await repo.findOneBy({ [field]: value });
  return { exists: !!data, field, value };
}
