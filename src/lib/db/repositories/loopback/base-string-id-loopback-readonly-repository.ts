import { Model } from 'mongoose';

import { ISchemaFactory } from '@lib/db/ischema.factory';
import { EnsureCheck, ensureString } from '@lib/validation/validation.helpers';
import { BaseStringIdLoopbackSchema } from '@lib/db/schemas/base-string-id-loopback.schema';
import { BaseStringIdLoopbackDomainModel } from '@/lib/db/domain-models/base.stringId.loopback.domain.model';
import { BaseLoopbackReadonlyRepository } from '@lib/db/repositories/loopback/base-loopback-readonly-repository';

export abstract class BaseStringIdLoopbackReadonlyRepository<
  TDomainModel extends BaseStringIdLoopbackDomainModel,
  TSchemaDefinition extends BaseStringIdLoopbackSchema,
> extends BaseLoopbackReadonlyRepository<
  string,
  TDomainModel,
  TSchemaDefinition
> {
  /**
   * Абстрактный репозиторий для чтения старых моделей из лупбека c stringId
   */
  protected constructor(
    protected dbModel: Model<TSchemaDefinition>,
    protected schemaFactory: ISchemaFactory<TDomainModel, TSchemaDefinition>,
    protected ensureDomainModel: EnsureCheck<TDomainModel>,
  ) {
    super(dbModel, schemaFactory, ensureString, ensureDomainModel);
  }
}
