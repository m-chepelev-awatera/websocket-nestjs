import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserSchemaDefinition } from './db/schemas/user-schema';
import {
  AccessTokenSchema,
  AccessTokenSchemaDefinition,
} from './db/schemas/access-token-schema';
import { UserSchemaFactory } from './db/schema-factories/user-schema-factory';
import { AccessTokenSchemaFactory } from './db/schema-factories/access-token-schema-factory';
import { UserRepository } from './db/repositories/user-repository';
import { AccessTokenRepository } from './db/repositories/access-token-repository';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserSchemaDefinition.name,
        schema: UserSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: AccessTokenSchemaDefinition.name,
        schema: AccessTokenSchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [
    UserSchemaFactory,
    UserRepository,
    AccessTokenSchemaFactory,
    AccessTokenRepository,
  ],
  exports: [UserRepository, AccessTokenRepository],
})
export class UserModule {}
