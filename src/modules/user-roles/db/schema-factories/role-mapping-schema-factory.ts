import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';

import { ISchemaFactory } from '@lib/db/ischema.factory';

import { filterUndefinedPropsOfDomainModel } from '@lib/helpers/object-helpers';
import { RoleMappingDomainModel } from '@user-roles/domain-models/role-mapping-domain-model';
import { RoleMappingSchemaDefinition } from '@user-roles/db/schemas/role-mapping-schema';

@Injectable()
export class RoleMappingSchemaFactory
  implements
    ISchemaFactory<RoleMappingDomainModel, RoleMappingSchemaDefinition>
{
  create(entity: RoleMappingDomainModel): RoleMappingSchemaDefinition {
    const filteredEntity = filterUndefinedPropsOfDomainModel(entity);

    return {
      _id: filteredEntity.id,
      ...omit(filteredEntity, ['id']),
    };
  }

  createFromSchema(
    schema: RoleMappingSchemaDefinition,
  ): RoleMappingDomainModel {
    return RoleMappingDomainModel.CreateFromDatabase({
      id: schema._id,
      ...omit(schema, ['_id']),
    });
  }
}
