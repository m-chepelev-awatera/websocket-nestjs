import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';

import { ISchemaFactory } from '@lib/db/ischema.factory';

import { filterUndefinedPropsOfDomainModel } from '@lib/helpers/object-helpers';
import { MessageDomainModel } from '@chats/domain-models/message.domain-model';
import { MessageSchemaDefinition } from '@chats/db/schemas/message.schema';

@Injectable()
export class MessageSchemaFactory
  implements ISchemaFactory<MessageDomainModel, MessageSchemaDefinition> {
  create(entity: MessageDomainModel): MessageSchemaDefinition {
    const filteredEntity = filterUndefinedPropsOfDomainModel(entity);

    return {
      _id: filteredEntity.id,
      ...omit(filteredEntity, ['id']),
    };
  }

  createFromSchema(schema: MessageSchemaDefinition): MessageDomainModel {
    return MessageDomainModel.CreateFromDatabase({
      id: schema._id,
      ...omit(schema, ['_id']),
    });
  }
}
