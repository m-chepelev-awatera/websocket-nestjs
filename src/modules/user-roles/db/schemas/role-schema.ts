import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MSchema, Types } from 'mongoose';

import { UserRoles } from '@user-roles/types';

@Schema({ versionKey: false, collection: 'Role' })
export class RoleSchemaDefinition {
  @Prop({ type: MSchema.Types.ObjectId, required: true })
  public readonly _id: Types.ObjectId;

  @Prop({
    type: String,
    enum: [...Object.values(UserRoles)],
  })
  public readonly name: UserRoles;

  @Prop({ type: Date })
  public readonly created: Date;

  @Prop({ type: Date })
  public readonly modified: Date;

  @Prop({ type: Boolean })
  public readonly deleted: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(RoleSchemaDefinition);
