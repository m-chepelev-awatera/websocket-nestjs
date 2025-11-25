import { Prop } from '@nestjs/mongoose';
import { BaseEntitySchema } from './base-entity.schema';

export abstract class BaseEntityStringIdSchema extends BaseEntitySchema {
  @Prop({ type: String, required: true })
  public readonly _id: string;
}
