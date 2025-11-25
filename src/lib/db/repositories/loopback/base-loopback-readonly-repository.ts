import { Document, Model } from 'mongoose';

import { NotFoundError } from '@lib/errors/not.found.error';
import { ISchemaFactory } from '@lib/db/ischema.factory';
import { EnsureCheck } from '@lib/validation/validation.helpers';
import { getOriginalSchemaValues } from '@/lib/transforms/to-original-schema-data-type-values';
import { BaseLoopbackDomainModel } from '@/lib/db/domain-models/base.loopback.domain.model';
import { BaseLoopbackSchema } from '@/lib/db/schemas/base-loopback.schema';

export abstract class BaseLoopbackReadonlyRepository<
  TId,
  TDomainModel extends BaseLoopbackDomainModel<TId>,
  TSchemaDefinition extends BaseLoopbackSchema,
> {
  /**
   * Абстрактный репозиторий для чтения старых моделей из лупбека
   */
  protected constructor(
    protected dbModel: Model<TSchemaDefinition>,
    protected schemaFactory: ISchemaFactory<TDomainModel, TSchemaDefinition>,
    protected ensureIdCheck: EnsureCheck<TId>,
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

  async getById(id: TId, withDeleted = false) {
    this.ensureIdCheck({ id });
    const item = await this.dbModel.findOne({ _id: id, deleted: withDeleted });

    if (!item)
      throw new NotFoundError(
        `Failed to find model with id '${id}' in '${this.dbModel.modelName}'`,
      );

    return this.toModel(item);
  }

  async getRawById(id: TId, withDeleted = false) {
    this.ensureIdCheck({ id });
    const item = await this.dbModel.findOne({ _id: id, deleted: withDeleted });

    if (!item)
      throw new NotFoundError(
        `Failed to find model with id '${id}' in '${this.dbModel.modelName}'`,
      );

    return item;
  }

  async getByIds(ids: ReadonlyArray<TId>) {
    ids.forEach((id) => this.ensureIdCheck({ id }));
    const items = await this.dbModel.find({
      _id: { $in: ids },
      deleted: false,
    });

    return this.toModels(items);
  }

  async tryGetById(id: TId) {
    this.ensureIdCheck({ id });

    const item = await this.dbModel.findOne({ _id: id, deleted: false });
    if (!item) return null;

    return this.toModel(item);
  }

  async getByIdIncludingDeleted(id: TId): Promise<TDomainModel> | never {
    return await this.getById(id, true);
  }
}
