import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';

import { ISchemaFactory } from '@lib/db/ischema.factory';

import { filterUndefinedPropsOfDomainModel } from '@lib/helpers/object-helpers';
import { SubscriptionDomainModel } from '@chats/domain-models/subscription.domain-model';
import { SubscriptionSchemaDefinition } from '@chats/db/schemas/subscription.schema';

@Injectable()
export class SubscriptionsSchemaFactory
  implements
    ISchemaFactory<SubscriptionDomainModel, SubscriptionSchemaDefinition>
{
  create(entity: SubscriptionDomainModel): SubscriptionSchemaDefinition {
    const filteredEntity = filterUndefinedPropsOfDomainModel(entity);

    return {
      _id: filteredEntity.id,
      ...omit(filteredEntity, ['id']),
    };
  }

  createFromSchema(
    schema: SubscriptionSchemaDefinition,
  ): SubscriptionDomainModel {
    return SubscriptionDomainModel.CreateFromDatabase({
      id: schema._id,
      ...omit(schema, ['_id']),
    });
  }
}
