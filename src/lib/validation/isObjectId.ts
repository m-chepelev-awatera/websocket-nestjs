import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { isObjectIdOrHexString } from 'mongoose';

export function IsObjectId<T extends object>(
  params: { each: boolean } = { each: false },
) {
  return function (object: T, propertyName: string) {
    const options: ValidationOptions = {
      message: `${propertyName} is not a valid ObjectId`,
      each: params.each,
    };
    registerDecorator({
      name: 'IsObjectId',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isObjectIdOrHexString(value);
        },
      },
    });
  };
}
