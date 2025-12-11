import { Types } from 'mongoose';
import { z } from 'zod';

export const ObjectIdSchema = z.union([
  z.instanceof(Types.ObjectId),
  z
    .string()
    .refine(v => Types.ObjectId.isValid(v), { message: 'Invalid ObjectId' })
    .transform(v => new Types.ObjectId(v)),
]);
