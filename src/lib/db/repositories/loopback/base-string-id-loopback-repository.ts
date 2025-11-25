import { Model } from 'mongoose';

import { ISchemaFactory } from '@lib/db/ischema.factory';
import { EnsureCheck, ensureString } from '@lib/validation/validation.helpers';
import { BaseLoopbackDomainModel } from '@/lib/db/domain-models/base.loopback.domain.model';
import { BaseStringIdLoopbackSchema } from '@lib/db/schemas/base-string-id-loopback.schema';
import { BaseLoopbackRepository } from '@lib/db/repositories/loopback/base-loopback-repository';

export abstract class BaseStringIdLoopbackRepository<
  TDomainModel extends BaseLoopbackDomainModel<string>,
  TSchemaDefinition extends BaseStringIdLoopbackSchema,
> extends BaseLoopbackRepository<string, TDomainModel, TSchemaDefinition> {
  /**
   * Абстрактный репозиторий с методами вставки, апдейта и получения модели по id для старых моделей из лупбека
   */
  protected constructor(
    protected dbModel: Model<TSchemaDefinition>,
    protected schemaFactory: ISchemaFactory<TDomainModel, TSchemaDefinition>,
    protected ensureDomainModel: EnsureCheck<TDomainModel>,
  ) {
    super(dbModel, schemaFactory, ensureString, ensureDomainModel);
  }
}
