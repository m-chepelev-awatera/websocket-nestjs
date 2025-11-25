import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { getOriginalSchemaValues } from '@/lib/transforms/to-original-schema-data-type-values';
import { AccessTokenDomainModel } from '@users/domain-models/access-token-domain-model';
import { AccessTokenSchemaDefinition } from '@users/db/schemas/access-token-schema';
import { AccessTokenSchemaFactory } from '@users/db/schema-factories/access-token-schema-factory';

@Injectable()
export class AccessTokenRepository {
  constructor(
    @InjectModel(AccessTokenSchemaDefinition.name)
    protected model: Model<AccessTokenSchemaDefinition>,
    protected schemaFactory: AccessTokenSchemaFactory,
  ) {}

  protected toModel(
    item: Document & AccessTokenSchemaDefinition,
  ): AccessTokenDomainModel {
    return this.schemaFactory.createFromSchema(
      getOriginalSchemaValues(item),
    ) as AccessTokenDomainModel;
  }

  async findById(token: string): Promise<AccessTokenDomainModel | null> {
    const result = await this.model.findById(token);

    return !result ? null : this.toModel(result);
  }
}
