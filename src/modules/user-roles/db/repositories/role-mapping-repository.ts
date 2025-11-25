import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';

import { getOriginalSchemaValues } from '@/lib/transforms/to-original-schema-data-type-values';
import { RoleMappingSchemaDefinition } from '@user-roles/db/schemas/role-mapping-schema';
import { RoleMappingSchemaFactory } from '@user-roles/db/schema-factories/role-mapping-schema-factory';
import { RoleMappingDomainModel } from '@user-roles/domain-models/role-mapping-domain-model';

@Injectable()
export class RoleMappingRepository {
  constructor(
    @InjectModel(RoleMappingSchemaDefinition.name)
    protected model: Model<RoleMappingSchemaDefinition>,
    protected schemaFactory: RoleMappingSchemaFactory,
  ) {}

  protected toModel(
    result: (mongoose.Document & RoleMappingSchemaDefinition) | null,
  ) {
    return !result
      ? null
      : this.schemaFactory.createFromSchema(getOriginalSchemaValues(result));
  }

  protected toModels(
    result: (mongoose.Document[] & RoleMappingSchemaDefinition[]) | [],
  ) {
    return result.map((singleSchemaInstance) =>
      this.schemaFactory.createFromSchema(
        getOriginalSchemaValues(singleSchemaInstance),
      ),
    );
  }

  async findByUserModelId(
    userModelId: Types.ObjectId,
  ): Promise<RoleMappingDomainModel[]> {
    const result = await this.model.find({ principalId: userModelId });
    return this.toModels(result);
  }
}
