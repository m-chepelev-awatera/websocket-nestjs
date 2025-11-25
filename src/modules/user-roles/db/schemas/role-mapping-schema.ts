import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MSchema, Types } from 'mongoose';

@Schema({ versionKey: false, collection: 'RoleMapping' })
export class RoleMappingSchemaDefinition {
  @Prop({ type: MSchema.Types.ObjectId, required: true })
  public readonly _id: Types.ObjectId;

  @Prop({ type: String })
  public readonly principalType: string;

  @Prop({ type: MSchema.Types.ObjectId })
  public readonly principalId: Types.ObjectId;

  @Prop({ type: MSchema.Types.ObjectId })
  public readonly roleId: Types.ObjectId;
}

export const RoleMappingSchema = SchemaFactory.createForClass(
  RoleMappingSchemaDefinition,
);
