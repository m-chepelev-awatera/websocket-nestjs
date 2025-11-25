import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { isNil } from 'lodash';
import { stringToObjectId } from '@lib/object-id-utils';
import { ArgumentError } from '@lib/errors/argument.error';

export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    if (isNil(value)) throw new BadRequestException('Id is required');

    try {
      return stringToObjectId(value);
    } catch (error) {
      if (error instanceof ArgumentError) {
        throw new BadRequestException(`${value} must be an ObjectId value`);
      }

      throw error;
    }
  }
}
