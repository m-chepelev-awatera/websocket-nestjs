import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { ISchemaFactory } from '@lib/db/ischema.factory';
import { UserDomainModel } from '@users/domain-models/user-domain-model';
import { UserSchemaDefinition } from '@users/db/schemas/user-schema';
import { filterUndefinedPropsOfDomainModel } from '@/lib/helpers/object-helpers';

@Injectable()
export class UserSchemaFactory
  implements ISchemaFactory<UserDomainModel, UserSchemaDefinition>
{
  create(entity: UserDomainModel): UserSchemaDefinition {
    const filteredEntity = filterUndefinedPropsOfDomainModel(entity);
    return {
      _id: filteredEntity.id,
      ...omit(filteredEntity, 'id'),
    } as UserSchemaDefinition;
  }

  createFromSchema(schema: UserSchemaDefinition): UserDomainModel {
    return UserDomainModel.CreateFromDatabase({
      id: schema._id,
      ...omit({ ...schema }, '_id'),
    });
  }
}
