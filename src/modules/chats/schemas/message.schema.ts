import { z } from 'zod';

import { ObjectIdSchema } from '@/lib/zod-schemas/object-id-schema';
import { BaseObjectIdModel } from '@/lib/db/domain-models/object.id.domain.model';

export const MessageType = z.enum(['system', 'user', 'log', 'todo']);
export type MessageType = z.infer<typeof MessageType>;

export const AuthorSchema = z.object({
  name: z.string(),
  nameEn: z.string(),
  userId: ObjectIdSchema,
});

export const MessageSchema = BaseObjectIdModel.extend({
  conversationId: ObjectIdSchema,
  type: MessageType,
  text: z.string(),
  files: z.array(z.unknown()).default([]),
  replyToId: ObjectIdSchema.optional(),
  author: AuthorSchema.optional(),
  edited: z.boolean().optional(),
});

export type AuthorSchema = z.infer<typeof AuthorSchema>;
export type MessageSchema = z.infer<typeof MessageSchema>;

export const CreateMessageSchema = MessageSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  edited: true,
  changeStamp: true,
});

export type CreateMessageSchema = z.infer<typeof CreateMessageSchema>;
