import { getEnsureCustom } from '@lib/validation/validation.helpers';
import { getZodBaseObjectIdDomainModel } from '@/lib/db/domain-models/object.id.domain.model';
import { ObjectIdDomainModel } from '@/lib/db/domain-models/object.id.domain.model';
import { SubscriptionSchema } from '@chats/schemas/subscription.schema';
import { SubscribeUserToConversation } from '../schemas/subscribe-user.schema';

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
}

export const ensureSubscription = getEnsureCustom(
  (dm: SubscriptionDomainModel) => dm instanceof SubscriptionDomainModel,
  `Not a valid ${SubscriptionDomainModel.name}`,
);
