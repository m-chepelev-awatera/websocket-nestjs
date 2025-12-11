import { Model, Types } from 'mongoose';

import { BaseLoopbackReadonlyRepository } from '@/lib/db/repositories/loopback/base-loopback-readonly-repository';
import { BaseObjectIdLoopbackSchema } from '@/lib/db/schemas/base-object-id-loopback.schema';
import { BaseObjectIdLoopbackDomainModel } from '@/lib/db/domain-models/base.objectId.loopback.domain.model';
import { ISchemaFactory } from '@/lib/db/ischema.factory';
import {
  EnsureCheck,
  ensureObjectId,
} from '@/lib/validation/validation.helpers';

export abstract class BaseObjectIdLoopbackReadonlyRepository<
  TDomainModel extends BaseObjectIdLoopbackDomainModel,
  TSchemaDefinition extends BaseObjectIdLoopbackSchema
> extends BaseLoopbackReadonlyRepository<
  Types.ObjectId,
  TDomainModel,
  TSchemaDefinition
> {
  protected constructor(
    protected dbModel: Model<TSchemaDefinition>,
    protected schemaFactory: ISchemaFactory<TDomainModel, TSchemaDefinition>,
    protected ensureDomainModel: EnsureCheck<TDomainModel>,
  ) {
    super(dbModel, schemaFactory, ensureObjectId, ensureDomainModel);
  }
}
