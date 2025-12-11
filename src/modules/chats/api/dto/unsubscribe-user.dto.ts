import { ObjectIdSchema } from '@/lib/zod-schemas/object-id-schema';
import { z } from 'zod';

export const UnsubscribeUserDto = z.object({
  subscriptionId: ObjectIdSchema,
});

export type UnsubscribeUserDto = z.infer<typeof UnsubscribeUserDto>;
