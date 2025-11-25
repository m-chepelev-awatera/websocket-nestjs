import { isObjectIdOrHexString, Types } from 'mongoose';
import { ArgumentError } from '@lib/errors/argument.error';

export function stringToObjectId(value: string) {
  const isValidObjectId =
    typeof value === 'string' && isObjectIdOrHexString(value);

  if (!isValidObjectId)
    throw new ArgumentError(`${value} must be an ObjectId value`);

  return new Types.ObjectId(value);
}
