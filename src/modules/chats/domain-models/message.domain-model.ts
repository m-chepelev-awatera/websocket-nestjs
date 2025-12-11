import { getEnsureCustom } from '@lib/validation/validation.helpers';
import {
  getZodBaseObjectIdDomainModel,
  ObjectIdDomainModel,
} from '@/lib/db/domain-models/object.id.domain.model';
import {
  CreateMessageSchema,
  MessageSchema,
} from '@chats/schemas/message.schema';

export class MessageDomainModel extends getZodBaseObjectIdDomainModel(
  MessageSchema,
) {
  protected constructor({ ...data }: MessageSchema) {
    super({ ...data });
  }

  static Create(data: CreateMessageSchema): MessageDomainModel {
    return new MessageDomainModel({
      ...ObjectIdDomainModel.CreateWithDefaultData(),
      ...data,
      edited: false,
    });
  }

  static CreateFromDatabase(data: MessageSchema): MessageDomainModel {
    return new MessageDomainModel(data);
  }
}

export const ensureMessage = getEnsureCustom(
  (dm: MessageDomainModel) => dm instanceof MessageDomainModel,
  `Not a valid ${MessageDomainModel.name}`,
);
