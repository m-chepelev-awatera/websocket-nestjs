import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';

import { ISchemaFactory } from '@lib/db/ischema.factory';

import { filterUndefinedPropsOfDomainModel } from '@lib/helpers/object-helpers';
import { RoleDomainModel } from '@user-roles/domain-models/role-domain-model';
import { RoleSchemaDefinition } from '@user-roles/db/schemas/role-schema';

@Injectable()
export class RoleSchemaFactory
  implements ISchemaFactory<RoleDomainModel, RoleSchemaDefinition>
{
  create(entity: RoleDomainModel): RoleSchemaDefinition {
    const filteredEntity = filterUndefinedPropsOfDomainModel(entity);

    return {
      _id: filteredEntity.id,
      ...omit(filteredEntity, ['id']),
    };
  }

  createFromSchema(schema: RoleSchemaDefinition): RoleDomainModel {
    return RoleDomainModel.CreateFromDatabase({
      id: schema._id,
      ...omit(schema, ['_id']),
    });
  }
}
