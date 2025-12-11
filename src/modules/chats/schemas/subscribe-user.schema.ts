import { ObjectIdSchema } from '@/lib/zod-schemas/object-id-schema';
import { z } from 'zod';

export const SubcribeUserSchema = z.object({
  conversationId: ObjectIdSchema,
  userId: ObjectIdSchema,
});

export type SubscribeUserToConversation = z.infer<typeof SubcribeUserSchema>;
