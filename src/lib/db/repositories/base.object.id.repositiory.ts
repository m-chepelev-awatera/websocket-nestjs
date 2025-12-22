import { Model, Types } from 'mongoose';

import { ISchemaFactory } from '@lib/db/ischema.factory';
import {
  EnsureCheck,
  ensureObjectId,
} from '@lib/validation/validation.helpers';
import { ObjectIdDomainModel } from '@/lib/domain-models/object.id.domain.model';
import { BaseRepository } from '@/lib/db/repositories/base-repository';
import { BaseEntityObjectIdSchema } from '../schemas/base-entity-object-id.schema';

export abstract class BaseObjectIdRepository<
  TDomainModel extends ObjectIdDomainModel,
  TSchemaDefinition extends BaseEntityObjectIdSchema
> extends BaseRepository<Types.ObjectId, TDomainModel, TSchemaDefinition> {
  /**
   * Абстрактный репозиторий для моделей, у которых идентификатором выступает Types.ObjectId монгуса
   */
  protected constructor(
    protected dbModel: Model<TSchemaDefinition>,
    protected schemaFactory: ISchemaFactory<TDomainModel, TSchemaDefinition>,
    ensureDomainModel: EnsureCheck<TDomainModel>,
  ) {
    super(dbModel, schemaFactory, ensureObjectId, ensureDomainModel);
  }
}
