import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class IdValidation implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Неверный формат id');
    }
    return new Types.ObjectId(value);
  }
}
