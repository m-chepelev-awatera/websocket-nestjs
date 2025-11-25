import { Types } from 'mongoose';

export function toObjectId({
  value,
  key,
}: {
  value: string;
  key: string;
}): Types.ObjectId {
  if (Types.ObjectId.isValid(value)) {
    return new Types.ObjectId(value);
  } else {
    throw new Error(`${key} is not a valid MongoId`);
  }
}

export function toObjectIdOrNull({
  value,
  key,
}: {
  value: string | null;
  key: string;
}): Types.ObjectId | null | void {
  if (value) {
    return toObjectId({ value, key });
  }
  if (value === null) {
    return null;
  }
  return undefined;
}

export function toArrayOfObjectIds({
  value,
  key,
}: {
  value: string[];
  key: string;
}): Types.ObjectId[] {
  if (value) {
    return value.map((item, index) =>
      toObjectId({ value: item, key: `${key}.${index}` }),
    );
  }
  return value;
}
