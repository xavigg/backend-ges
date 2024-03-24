import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'MinMaxPrice', async: false })
export class MinMaxPriceValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const { object } = args;
    const minPrice = object['minPrice'];
    const maxPrice = object['maxPrice'];

    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Min price cannot be greater than max price';
  }
}
