import { Types } from 'mongoose';
import {
  isNotRequired,
  ensureString,
  ensureValidDate,
  getEnsureCustom,
} from '@lib/validation/validation.helpers';

import {
  BaseObjectIdLoopbackDomainModel,
  IBaseObjectIdLoopbackDomainModel,
} from '@/lib/db/domain-models/base.objectId.loopback.domain.model';

export interface IConversation extends IBaseObjectIdLoopbackDomainModel {
  archived?: boolean;
  pinnedMessageId?: string;
  lastMessageSentDate?: Date;
}

export class ConversationDomainModel extends BaseObjectIdLoopbackDomainModel {
  private constructor({ ...data }: IConversation) {
    super({ ...data });
    this.archived = data.archived;
    this.pinnedMessageId = data.pinnedMessageId
      ? isNotRequired(ensureString, {
          pinnedMessageId: data.pinnedMessageId,
        })
      : undefined;
    this.lastMessageSentDate = data.lastMessageSentDate
      ? isNotRequired(ensureValidDate, {
          lastMessageSentDate: data.lastMessageSentDate,
        })
      : undefined;
  }

  public static Create(data: Partial<IConversation>): ConversationDomainModel {
    const modifiedData = { ...data };
    modifiedData.id = data.id || new Types.ObjectId();
    modifiedData.deleted = data.deleted || false;
    modifiedData.modifiedDate = data.modifiedDate || new Date();
    return new ConversationDomainModel({ ...(modifiedData as IConversation) });
  }

  public static CreateFromDatabase(
    dataFromDb: IConversation,
  ): ConversationDomainModel {
    return new ConversationDomainModel(dataFromDb);
  }

  public readonly archived?: boolean;
  public readonly pinnedMessageId?: string;
  public readonly lastMessageSentDate?: Date;
}

export const ensureConversation = getEnsureCustom(
  (dm: ConversationDomainModel) => dm instanceof ConversationDomainModel,
  `Not a valid ${ConversationDomainModel.name}`,
);
