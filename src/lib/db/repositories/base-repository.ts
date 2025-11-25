import { ClientSession, Model, Document } from 'mongoose';

import { isDuplicateError } from '@lib/errors/db.error.helpers';
import { ConflictError } from '@lib/errors/conflict.error';
import { NotFoundError } from '@lib/errors/not.found.error';
import { ISchemaFactory } from '@lib/db/ischema.factory';
import { BaseDomainModel } from '@/lib/db/domain-models/base.domain.model';
import { EnsureCheck } from '@lib/validation/validation.helpers';
import { getOriginalSchemaValues } from '@lib/transforms/to-original-schema-data-type-values';
import { BaseEntitySchema } from '../schemas/base-entity.schema';

export abstract class BaseRepository<
  TId,
  TDomainModel extends BaseDomainModel<TId>,
  TSchemaDefinition extends BaseEntitySchema,
> {
  /**
   * Абстрактный репозиторий с методами вставки, апдейта и получения модели по id
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

  async insert(domainModel: TDomainModel, session?: ClientSession) {
    this.ensureDomainModel({ domainModel });
    try {
      await this.dbModel.create([this.schemaFactory.create(domainModel)], {
        session: session,
      });
    } catch (e) {
      if (isDuplicateError(e)) {
        throw new ConflictError(
          `Document for model '${domainModel.toString()}' already exists in '${
            this.dbModel.modelName
          }'`,
        );
      } else throw e;
    }
  }

  async update(domainModel: TDomainModel, session?: ClientSession) {
    this.ensureDomainModel({ domainModel });

    const oldStamp = domainModel.changeStamp;
    domainModel.updateChangeStamp();
    const schemaDocument = this.schemaFactory.create(domainModel);
    let result;
    try {
      result = await this.dbModel.findOneAndReplace(
        { _id: domainModel.id, changeStamp: oldStamp },
        schemaDocument,
        {
          new: true,
          session: session,
        },
      );
    } catch (e) {
      if (isDuplicateError(e)) {
        throw new ConflictError(
          `Document for model '${domainModel.toString()}' already exists in '${
            this.dbModel.modelName
          }'`,
        );
      } else throw e;
    }
    if (!result)
      throw new ConflictError(
        `Update error: Failed to find document in '${this.dbModel.modelName}' with '${domainModel.id}' and changeStamp ${domainModel.changeStamp}`,
      );

    return this.toModel(result);
  }

  async getById(id: TId) {
    this.ensureIdCheck({ id });
    const item = await this.dbModel.findOne({ _id: id });

    if (!item)
      throw new NotFoundError(
        `Failed to find model with id '${id}' in '${this.dbModel.modelName}'`,
      );

    return this.toModel(item);
  }

  async getByIds(ids: ReadonlyArray<TId>) {
    ids.forEach((id) => this.ensureIdCheck({ id }));
    const items = await this.dbModel.find({ _id: { $in: ids } });

    return this.toModels(items);
  }

  async tryGetById(id: TId) {
    this.ensureIdCheck({ id });
    const item = await this.dbModel.findOne({ _id: id });
    if (!item) return null;

    return this.toModel(item);
  }

  async deleteById(id: TId) {
    this.ensureIdCheck({ id });

    const deletedRequest = await this.dbModel.findOneAndDelete({ _id: id });

    if (!deletedRequest) {
      throw new NotFoundError(
        `Failed to delete model with id '${id}' in '${this.dbModel.modelName}'`,
      );
    }
  }
}
