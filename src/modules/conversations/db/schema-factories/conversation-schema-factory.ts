import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';

import { ISchemaFactory } from '@lib/db/ischema.factory';

import { filterUndefinedPropsOfDomainModel } from '@lib/helpers/object-helpers';
import { ConversationDomainModel } from '@/modules/conversations/domain-models/conversation-domain-model';
import { ConversationSchemaDefinition } from '@/modules/conversations/db/schemas/conversation-schema';

@Injectable()
export class ConversationSchemaFactory
  implements
    ISchemaFactory<ConversationDomainModel, ConversationSchemaDefinition> {
  create(entity: ConversationDomainModel): ConversationSchemaDefinition {
    const filteredEntity = filterUndefinedPropsOfDomainModel(entity);

    return {
      _id: filteredEntity.id,
      ...omit(filteredEntity, ['id']),
    };
  }

  createFromSchema(
    schema: ConversationSchemaDefinition,
  ): ConversationDomainModel {
    return ConversationDomainModel.CreateFromDatabase({
      id: schema._id,
      ...omit(schema, ['_id']),
    });
  }
}
