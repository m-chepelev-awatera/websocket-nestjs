// @ts-check
import { Document, Model, Types } from 'mongoose';
import { NotFoundError } from '@lib/errors/not.found.error';
import { ISchemaFactory } from '@lib/db/ischema.factory';
import {
  EnsureCheck,
  ensureObjectId,
} from '@lib/validation/validation.helpers';
import { getOriginalSchemaValues } from '@/lib/transforms/to-original-schema-data-type-values';
import { MinBaseDomainModel } from '../domain-models/min-base.domain-model';
import { MinBaseLoopbackSchema } from '../schemas/min-base-loopback.schema';

export abstract class MinBaseReadonlyRepository<
  TDomainModel extends MinBaseDomainModel,
  TSchemaDefinition extends MinBaseLoopbackSchema,
> {
  /**
   * Абстрактный репозиторий для чтения старых моделей из лупбека
   */
  protected constructor(
    protected dbModel: Model<TSchemaDefinition>,
    protected schemaFactory: ISchemaFactory<TDomainModel, TSchemaDefinition>,
    protected ensureDomainModel: EnsureCheck<TDomainModel>,
  ) {}

  protected toModels(items: Document[] & TSchemaDefinition[]): TDomainModel[] {
    return items.map(
      (i) =>
        this.schemaFactory.createFromSchema(
          getOriginalSchemaValues(i),
        ) as TDomainModel,
    );
  }

  protected toModel(item: Document & TSchemaDefinition): TDomainModel {
    return this.toModels([item])[0];
  }

  async getById(id: Types.ObjectId) {
    ensureObjectId({ id });
    const item = await this.dbModel.findOne({ _id: id });

    if (!item)
      throw new NotFoundError(
        `Failed to find model with id '${id}' in '${this.dbModel.modelName}'`,
      );

    return this.toModel(item);
  }

  async getByIds(ids: ReadonlyArray<Types.ObjectId>) {
    ids.forEach((id) => ensureObjectId({ id }));
    const items = await this.dbModel.find({
      _id: { $in: ids },
    });

    return this.toModels(items);
  }

  async tryGetById(id: Types.ObjectId) {
    ensureObjectId({ id });

    const item = await this.dbModel.findOne({ _id: id });
    if (!item) return null;

    return this.toModel(item);
  }
}
