import { Model } from 'mongoose';
import { ISchemaFactory } from '@lib/db/ischema.factory';
import {
  EnsureCheck,
  notNullOrEmptyString,
} from '@lib/validation/validation.helpers';
import { BaseRepository } from '@/lib/db/repositories/base-repository';
import { StringIdDomainModel } from '@/lib/domain-models/string.id.domain.model';
import { BaseEntityStringIdSchema } from '../schemas/base-entity-string-id.schema';

export abstract class BaseStringIdRepository<
  TDomainModel extends StringIdDomainModel,
  TSchemaDefinition extends BaseEntityStringIdSchema
> extends BaseRepository<string, TDomainModel, TSchemaDefinition> {
  /**
   * Абстрактный репозиторий для моделей, у которых идентификатором выступает строка
   */
  protected constructor(
    protected dbModel: Model<TSchemaDefinition>,
    protected schemaFactory: ISchemaFactory<TDomainModel, TSchemaDefinition>,
    ensureDomainModel: EnsureCheck<TDomainModel>,
  ) {
    super(dbModel, schemaFactory, notNullOrEmptyString, ensureDomainModel);
  }
}
