import { Injectable } from '@nestjs/common';
import { ISchemaFactory } from '@lib/db/ischema.factory';
import { AccessTokenDomainModel } from '@users/domain-models/access-token-domain-model';
import { AccessTokenSchemaDefinition } from '@users/db/schemas/access-token-schema';

@Injectable()
export class AccessTokenSchemaFactory
  implements
    ISchemaFactory<AccessTokenDomainModel, AccessTokenSchemaDefinition>
{
  create(entity: AccessTokenDomainModel): AccessTokenSchemaDefinition {
    return {
      _id: entity.id,
      ttl: entity.ttl,
      created: entity.created,
      userId: entity.userId,
    } as AccessTokenSchemaDefinition;
  }

  createFromSchema(
    schema: AccessTokenSchemaDefinition,
  ): AccessTokenDomainModel {
    return AccessTokenDomainModel.CreateFromDatabase({
      id: schema._id,
      ttl: schema.ttl,
      created: schema.created,
      userId: schema.userId,
    });
  }
}
