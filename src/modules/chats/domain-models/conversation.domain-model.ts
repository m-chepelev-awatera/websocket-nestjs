import { getEnsureCustom } from '@lib/validation/validation.helpers';
import { getZodBaseObjectIdDomainModel } from '@/lib/domain-models/object.id.domain.model';
import { ConversationSchema } from '@chats/schemas/conversation.schema';
import { ObjectIdDomainModel } from '@/lib/domain-models/object.id.domain.model';

export class ConversationDomainModel extends getZodBaseObjectIdDomainModel(
  ConversationSchema,
) {
  protected constructor({ ...data }: ConversationSchema) {
    super({ ...data });
  }

  static Create(title: string): ConversationDomainModel {
    return new ConversationDomainModel({
      ...ObjectIdDomainModel.CreateWithDefaultData(),
      archived: false,
      title,
    });
  }

  static CreateFromDatabase(data: ConversationSchema): ConversationDomainModel {
    return new ConversationDomainModel(data);
  }
}

export const ensureConversation = getEnsureCustom(
  (dm: ConversationDomainModel) => dm instanceof ConversationDomainModel,
  `Not a valid ${ConversationDomainModel.name}`,
);
