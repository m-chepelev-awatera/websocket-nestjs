import { Model, Types } from 'mongoose';
import { ISchemaFactory } from '@lib/db/ischema.factory';

import {
  EnsureCheck,
  ensureObjectId,
} from '@lib/validation/validation.helpers';
import { BaseLoopbackDomainModel } from '@/lib/db/domain-models/base.loopback.domain.model';
import { BaseObjectIdLoopbackSchema } from '@lib/db/schemas/base-object-id-loopback.schema';
import { BaseLoopbackRepository } from '@lib/db/repositories/loopback/base-loopback-repository';

export abstract class BaseObjectIdLoopbackRepository<
  TDomainModel extends BaseLoopbackDomainModel<Types.ObjectId>,
  TSchemaDefinition extends BaseObjectIdLoopbackSchema,
> extends BaseLoopbackRepository<
  Types.ObjectId,
  TDomainModel,
  TSchemaDefinition
> {
  /**
   * Абстрактный репозиторий с методами вставки, апдейта и получения модели по id для старых моделей из лупбека
   */
  protected constructor(
    protected dbModel: Model<TSchemaDefinition>,
    protected schemaFactory: ISchemaFactory<TDomainModel, TSchemaDefinition>,
    protected ensureDomainModel: EnsureCheck<TDomainModel>,
  ) {
    super(dbModel, schemaFactory, ensureObjectId, ensureDomainModel);
  }
}
