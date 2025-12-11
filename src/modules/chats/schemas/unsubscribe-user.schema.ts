import { ObjectIdSchema } from '@/lib/zod-schemas/object-id-schema';
import { z } from 'zod';

import { SubcribeUserSchema } from '@chats/schemas/subscribe-user.schema';

export const UnsubscribeUserSchema = SubcribeUserSchema.extend({
  subscriptionId: ObjectIdSchema,
});

export type UnsubscribeUserFromConversation = z.infer<
  typeof UnsubscribeUserSchema
>;
