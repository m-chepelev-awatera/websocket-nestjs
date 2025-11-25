import { ClientSession, Model } from 'mongoose';

import { ISchemaFactory } from '@lib/db/ischema.factory';
import { isDuplicateError } from '@lib/errors/db.error.helpers';
import { ConflictError } from '@lib/errors/conflict.error';
import { NotFoundError } from '@lib/errors/not.found.error';
import { EnsureCheck } from '@lib/validation/validation.helpers';
import { BaseLoopbackDomainModel } from '@/lib/db/domain-models/base.loopback.domain.model';
import { BaseLoopbackSchema } from '@lib/db/schemas/base-loopback.schema';
import { BaseLoopbackReadonlyRepository } from '@lib/db/repositories/loopback/base-loopback-readonly-repository';

export abstract class BaseLoopbackRepository<
  TId,
  TDomainModel extends BaseLoopbackDomainModel<TId>,
  TSchemaDefinition extends BaseLoopbackSchema,
> extends BaseLoopbackReadonlyRepository<TId, TDomainModel, TSchemaDefinition> {
  /**
   * Абстрактный репозиторий с методами вставки, апдейта и получения модели по id для старых моделей из лупбека
   */
  protected constructor(
    protected dbModel: Model<TSchemaDefinition>,
    protected schemaFactory: ISchemaFactory<TDomainModel, TSchemaDefinition>,
    protected ensureIdCheck: EnsureCheck<TId>,
    protected ensureDomainModel: EnsureCheck<TDomainModel>,
  ) {
    super(dbModel, schemaFactory, ensureIdCheck, ensureDomainModel);
  }

  async insert(domainModel: TDomainModel, session?: ClientSession) {
    this.ensureDomainModel({ domainModel });
    try {
      const result = await this.dbModel.create(
        [this.schemaFactory.create(domainModel)],
        {
          session: session,
        },
      );

      return this.toModel(result[0]);
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

    if (oldStamp) {
      domainModel.updateChangeStamp();
    }

    const schemaDocument = this.schemaFactory.create(domainModel);
    let result;

    const filter = {
      _id: domainModel.id,
      deleted: false,
    };

    if (oldStamp) {
      filter['changeStamp'] = oldStamp;
    }

    try {
      result = await this.dbModel.findOneAndReplace(filter, schemaDocument, {
        returnDocument: 'after',
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

    if (!result) {
      const errorMessage = oldStamp
        ? `Update error: Failed to find document in '${this.dbModel.modelName}' with '${domainModel.id}' and changeStamp ${domainModel.changeStamp}`
        : `Update error: Failed to find document in '${this.dbModel.modelName}' with '${domainModel.id}'`;
      throw new ConflictError(errorMessage);
    }

    return this.toModel(result);
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

  async softDeleteById(id: TId): Promise<void> | never {
    const domainModel = await this.getById(id);

    domainModel.delete();

    const schemaDocument = this.schemaFactory.create(domainModel);

    const result = await this.dbModel.findOneAndReplace(
      { _id: domainModel.id },
      schemaDocument,
    );
    if (!result)
      throw new NotFoundError(
        `Update error: Failed to find document in '${this.dbModel.modelName}' with '${domainModel.id}'`,
      );
  }
}
