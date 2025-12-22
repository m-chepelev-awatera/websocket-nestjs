import { getEnsureCustom } from '@lib/validation/validation.helpers';
import { getZodBaseObjectIdDomainModel } from '@/lib/domain-models/object.id.domain.model';
import { ObjectIdDomainModel } from '@/lib/domain-models/object.id.domain.model';
import { SubscriptionSchema } from '@chats/schemas/subscription.schema';
import { SubscribeUserToConversation } from '../schemas/subscribe-user.schema';
import { NewMessageForSubSchema } from '../schemas/message.schema';
import { Mutable } from '@/lib/types/mutable-object';

export class SubscriptionDomainModel extends getZodBaseObjectIdDomainModel(
  SubscriptionSchema,
) {
  protected constructor({ ...data }: SubscriptionSchema) {
    super({ ...data });
  }

  static Create(data: SubscribeUserToConversation): SubscriptionDomainModel {
    return new SubscriptionDomainModel({
      ...ObjectIdDomainModel.CreateWithDefaultData(),
      ...data,
      isRead: false,
      unreadMessagesCount: 0,
    });
  }

  static CreateFromDatabase(data: SubscriptionSchema): SubscriptionDomainModel {
    return new SubscriptionDomainModel(data);
  }

  processNewMessage(data: NewMessageForSubSchema) {
    const mutableThis = this as MutableSubscriptionDomainModel;

    mutableThis.lastMessageText = data.text;
    mutableThis.lastMessageDate = data.updatedAt;

    if (this.isRead) {
      mutableThis.isRead = false;
      mutableThis.unreadMessagesCount = 1;
    } else {
      mutableThis.unreadMessagesCount += 1;
    }
  }
}

type MutableSubscriptionDomainModel = Mutable<SubscriptionDomainModel>;

export const ensureSubscription = getEnsureCustom(
  (dm: SubscriptionDomainModel) => dm instanceof SubscriptionDomainModel,
  `Not a valid ${SubscriptionDomainModel.name}`,
);
